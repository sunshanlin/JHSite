# Scratch VO with edge-tts (timing only; the Botnoi files replace these one for one, then run measure-vo.py).
import asyncio, io, pathlib, subprocess, sys
import edge_tts
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'public' / 'audio' / 'vo'
VOICE = 'th-TH-PremwadeeNeural'

async def main():
    lines = [l.rstrip('\n').split('\t') for l in io.open(HERE / 'vo-botnoi.txt', encoding='utf-8')]
    for no, text in lines:
        await edge_tts.Communicate(text, VOICE, rate='-5%').save(str(OUT / f'loc-{no}.mp3'))
        print('scratch', no)
    subprocess.check_call([sys.executable, str(HERE / 'measure-vo.py')])

asyncio.run(main())
