# Python port of the parts of CaesarSuite (https://github.com/jglim/CaesarSuite, MIT License) needed to
# read diagnostic services, request bytes and output scaling from Mercedes CBF files.
"""Minimal Python port of CaesarSuite's CBF reader (jglim/CaesarSuite, MIT) - only what's
needed to list diag services, their request bytes and output presentations/scales."""
import struct, sys, json

class R:
    def __init__(self, data): self.d = data; self.p = 0
    def seek(self, p): self.p = p
    def u8(self): v = self.d[self.p]; self.p += 1; return v
    def i16(self): v = struct.unpack_from('<h', self.d, self.p)[0]; self.p += 2; return v
    def u16(self): v = struct.unpack_from('<H', self.d, self.p)[0]; self.p += 2; return v
    def i32(self): v = struct.unpack_from('<i', self.d, self.p)[0]; self.p += 4; return v
    def u32(self): v = struct.unpack_from('<I', self.d, self.p)[0]; self.p += 4; return v
    def f32(self): v = struct.unpack_from('<f', self.d, self.p)[0]; self.p += 4; return v
    def bytes(self, n): v = self.d[self.p:self.p + n]; self.p += n; return v
    def cstr(self, at):
        e = self.d.index(b'\0', at)
        return self.d[at:e].decode('latin-1')

class BF:
    """bitflag-driven field reader"""
    def __init__(self, r, flags, base): self.r = r; self.f = flags; self.base = base
    def on(self):
        s = self.f & 1; self.f >>= 1; return bool(s)
    def i32(self, d=0): return self.r.i32() if self.on() else d
    def i16(self, d=0): return self.r.i16() if self.on() else d
    def u16(self, d=0): return self.r.u16() if self.on() else d
    def u8(self, d=0): return self.r.u8() if self.on() else d
    def i8(self, d=0): return self.r.u8() if self.on() else d
    def f32(self, d=0.0): return self.r.f32() if self.on() else d
    def s(self):
        if not self.on(): return None
        off = self.r.i32(); return self.r.cstr(off + self.base)
    def dump(self, size):
        if not self.on(): return b''
        off = self.r.i32(); return self.r.d[off + self.base: off + self.base + size]

STUB = 0x410

class Scale:
    def __init__(self, r, base):
        r.seek(base); b = BF(r, r.u16(), base)
        self.lo = b.i32(); self.hi = b.i32(); self.plo = b.i32(); self.phi = b.i32()
        self.mul = b.f32(); self.add = b.f32()
        b.i32(); b.i32(); b.i32(); b.i32()
        self.enum_desc = b.i32(-1); b.i32()

class Pres:
    def __init__(self, r, base):
        r.seek(base); flags = r.u32(); ext = r.u16(); b = BF(r, flags, base)
        self.q = b.s(); self.desc = b.i32(-1); self.scale_off = b.i32(-1); self.scale_cnt = b.i32()
        self.unk5 = b.i32(-1); [b.i32() for _ in range(7)]
        b.i16(); b.i16(); b.i16(); self.unit = b.i32(-1)
        b.i32(); b.i32(); self.enum_max = b.i32(); self.unk14 = b.i32(-1)
        b.i32(); self.desc2 = b.i32(-1); self.unk17 = b.i32(-1); b.i32()
        self.unk19 = b.i32(-1); self.len1a = b.i32(-1); self.idt = b.i8(-1); self.type1c = b.i8(-1)
        b.i8(); self.sign = b.i8(); self.order = b.i8(); b.i32()
        b.f = ext
        self.len21 = b.i32(); self.unk22 = b.i32(-1); b.i16(); b.i32(); b.i32(); b.i32()
        self.scales = []
        if self.scale_cnt > 0:
            tb = base + self.scale_off
            for i in range(self.scale_cnt):
                r.seek(tb + i * 4); self.scales.append(Scale(r, tb + r.i32()))

    def dtype(self):
        if self.unk14 != -1 or self.scale_off != -1: return 20
        if -1 not in (self.unk5,) or self.unk17 != -1 or self.unk19 != -1 or self.unk22 != -1:
            if self.unk5 != -1 or self.unk17 != -1 or self.unk19 != -1 or self.unk22 != -1: return 18
        if self.idt != -1:
            return {6: 17, 7: 22, 8: 6, 5: 6}.get(self.idt, -1)
        return 5 if self.sign in (1, 2) else 2

INT_SIZES = [0, 1, 4, 8, 16, 32, 64]

class Prep:
    def __init__(self, r, base, bitpos, mode, ecu, svc):
        self.bitpos = bitpos; self.mode = mode
        r.seek(base); b = BF(r, r.u32(), base)
        self.q = b.s(); self.name = b.i32(-1); b.u8(); b.u8()
        self.altw = b.i32(); b.i32(); self.info_idx = b.i32(); self.pres_idx = b.i32(); b.i32()
        self.sysparam = b.i16(-1); self.dumpmode = b.i16(); self.dumpsize = b.i32()
        self.pres = None; self.bits = 0; self.kind = '?'
        mE, mH, mL = mode & 0xF000, mode & 0xFF0, mode & 0xF
        try:
            if (mode & 0xF00) == 0x300:
                if mH == 0x320: self.bits = INT_SIZES[mL]; self.kind = 'int'
                elif mH == 0x330: self.bits = self.altw; self.kind = 'bits'
                else: self.kind = 'it'
            elif self.sysparam == -1:
                if mE == 0x8000: p = ecu.ipres[self.info_idx]; self.kind = 'info'
                elif mE == 0x2000: p = ecu.pres[self.pres_idx]; self.kind = 'pres'
                else: p = None
                if p:
                    self.pres = p
                    self.bits = p.len1a if p.len1a > 0 else p.len21
                    if p.type1c == 0: self.bits *= 8
            else:
                if mH == 0x420: self.bits = INT_SIZES[mL]; self.kind = 'int'
                elif mH == 0x430: self.bits = self.altw; self.kind = 'bits'
                else: self.kind = 'sys%d' % self.sysparam
        except Exception as e:
            self.kind = 'err:' + str(e)

class Svc:
    def __init__(self, r, base, ecu, lang):
        r.seek(base); f1 = r.u32(); f2 = r.u32(); b = BF(r, f1, base)
        self.q = b.s(); self.name = b.i32(-1); self.desc = b.i32(-1)
        self.stype = b.u16(); b.u16(); b.u16(); b.u16()
        b.i32(); b.i32(); b.i32(); b.i32(); b.i32(); b.i32()
        self.inref = b.s()
        ucnt = b.i32(); uoff = b.i32(); b.i32(); b.i32()
        rqc = b.i16(); rqo = b.i32()
        wc = b.i32(); wo = b.i32()
        self.req = bytes(r.d[base + rqo: base + rqo + rqc]) if rqc > 0 else b''
        self.outs = []
        ob = base + wo
        for i in range(wc):
            r.seek(ob + i * 8); cnt = r.i32(); off = r.i32()
            for j in range(cnt):
                tb = ob + off
                r.seek(tb + j * 10)
                eo = r.i32(); bp = r.i32(); md = r.u16()
                try: self.outs.append(Prep(r, tb + eo, bp, md, ecu, self))
                except Exception as e: pass

class ECU:
    def __init__(self, r, base, hdr, lang):
        r.seek(base); f1 = r.u32(); f2 = r.u16(); r.i32(); b = BF(r, f1, base)
        self.q = b.s(); self.name = b.i32(-1); self.desc = b.i32(-1); b.s()
        b.i32(); b.i32(); b.i32(); b.i32(); b.s(); b.s(); b.s()
        dbo = hdr['spool'] + STUB + hdr['hsize'] + 4
        b.i16(); b.i16(); b.i16(); b.i32(); b.i16(); b.i32()
        def blk():
            return [b.i32() + dbo, b.i32(), b.i32(), None]
        var = blk(); var[3] = b.i32()
        job = blk(); job[3] = b.i32()
        dtc = blk(); dtc[3] = b.i32()
        env = [b.i32() + dbo, b.i32(), b.i32()]
        b.f = f2
        b.i32()
        vcd = blk(); vcd[3] = b.i32()
        pres = blk(); pres[3] = b.i32()
        ipres = blk(); ipres[3] = b.i32()
        self.pres = self._pres(r, pres)
        self.ipres = self._pres(r, ipres)
        self.svcs = []
        for i in range(job[1]):
            r.seek(job[0] + i * job[2]); off = r.i32()
            try: self.svcs.append(Svc(r, job[0] + off, self, lang))
            except Exception as e: print('svc err', i, e, file=sys.stderr)

    def _pres(self, r, blk):
        out = []
        for i in range(blk[1]):
            r.seek(blk[0] + i * blk[2]); off = r.i32()
            out.append(Pres(r, blk[0] + off))
        return out

def load(path):
    d = open(path, 'rb').read(); r = R(d)
    r.seek(STUB); hsize = r.i32(); base = r.p
    b = BF(r, r.u16(), base)
    ver = b.i32(); b.i32(); ecucnt = b.i32(); ecuoff = b.i32(); ctfoff = b.i32(); spool = b.i32()
    hdr = dict(hsize=hsize, spool=spool)
    # CTF strings
    ctfb = base + ctfoff; r.seek(ctfb); cb = BF(r, r.u16(), ctfb)
    cb.i32(); cb.s(); cb.i16(); cb.i32(); lcnt = cb.i32(); ltab = cb.i32()
    lt = ltab + ctfb; r.seek(lt); lbase = r.i32() + lt
    r.seek(lbase); lb = BF(r, r.u16(), lbase); lb.s(); lb.i16(); lb.i32(); lb.i32(); scount = lb.i32()
    st = hsize + STUB + 4; strings = []
    for i in range(scount):
        r.seek(st + i * 4); o = r.i32(); strings.append(r.cstr(st + o))
    ecus = []
    et = ecuoff + base
    for i in range(ecucnt):
        r.seek(et + i * 4); ecus.append(ECU(r, et + r.i32(), hdr, strings))
    return strings, ecus

def S(strings, i):
    return strings[i] if 0 <= i < len(strings) else ''
