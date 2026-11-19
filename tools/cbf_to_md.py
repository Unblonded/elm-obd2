"""Dump a Mercedes .cbf diagnostic description to a Markdown table of data requests.
Usage: python3 tools/cbf_to_md.py FILE.cbf OUT.md "Title" 7E0 7E8"""
import sys, os, json, tempfile, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from cbf import load, S

def rows(path):
    strings, ecus = load(path)
    out = []
    for s in ecus[0].svcs:
        if s.stype not in (5, 22) or not s.req: continue
        for p in s.outs:
            pr = p.pres
            d = dict(q=s.q, name=S(strings, s.name), req=s.req.hex().upper(), bitpos=p.bitpos, bits=p.bits)
            if pr:
                d.update(unit=S(strings, pr.unit), sign=pr.sign,
                         scales=[dict(mul=sc.mul, add=sc.add, lo=sc.lo, hi=sc.hi, e=S(strings, sc.enum_desc)) for sc in pr.scales[:20]])
            out.append(d)
    return out
def fmt(x):
    s=('%.6f'%x).rstrip('0').rstrip('.'); return s if s not in ('','-0') else '0'
def formula(d):
    b=d['bitpos']//8; bit=d['bitpos']%8; n=d['bits']; sc=d.get('scales',[])
    signed=d.get('sign') in (1,2)
    if n==1: return [b], f'bit(A,{bit})', True
    if n in (2,3,4,5,6,7): raw=f'((A>>{bit})&{(1<<n)-1})'; offs=[b]
    elif n==8: raw='s8(A)' if signed else 'A'; offs=[b]
    elif n==16: raw='s16(A,B)' if signed else 'u16(A,B)'; offs=[b,b+1]
    elif n==32: raw='(u16(A,B)*65536+u16(C,D))'; offs=[b,b+1,b+2,b+3]
    else: return None,None,False
    isenum = len(sc)>1 or (sc and sc[0]['e'])
    if sc and not isenum:
        m,a=sc[0]['mul'],sc[0]['add']
        f=raw
        if abs(m-1)>1e-9: f=f'{f}*{fmt(m)}'
        if abs(a)>1e-9: f=f'{f}{"+" if a>0 else "-"}{fmt(abs(a))}'
        return offs,f,False
    return offs,raw,bool(isenum)
def fix(s):
    try: return s.encode('latin-1').decode('utf-8')
    except Exception: return s
out=[]
for d in rows(sys.argv[1]):
    offs,f,isenum=formula(d)
    if offs is None: continue
    e=''
    if isenum and d.get('scales'):
        e='; '.join(f"{s['lo']}{'-'+str(s['hi']) if s['hi']!=s['lo'] else ''}={fix(s['e'])}" for s in d['scales'][:20])
    out.append((d['req'],offs,f,fix(d.get('unit') or ''),fix(d['name']),e))
seen=set(); rows=[]
for o in out:
    k=(o[0],tuple(o[1]),o[2],o[4])
    if k in seen: continue
    seen.add(k); rows.append(o)
rows.sort(key=lambda o:(o[0],o[1][0]))
title, hdr, resp = sys.argv[3], sys.argv[4], sys.argv[5]
with open(sys.argv[2],'w') as fh:
    fh.write(f'# {title}\n\nExtracted from the Mercedes CBF diagnostic description. Send to header `{hdr}`, response from `{resp}`.\n')
    fh.write('Byte offsets use the app convention (index 0 = positive response SID). Formulas are in the app\'s formula syntax.\n\n')
    fh.write('| request | bytes | formula | unit | name | values |\n|---|---|---|---|---|---|\n')
    for r in rows:
        fh.write(f"| `{r[0]}` | {','.join(map(str,r[1]))} | `{r[2]}` | {r[3]} | {r[4].replace('|','/')} | {r[5].replace('|','/')} |\n")
print(len(rows))
