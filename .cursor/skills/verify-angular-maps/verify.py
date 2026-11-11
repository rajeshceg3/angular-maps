#!/usr/bin/env python3
"""Build angular-maps and verify the rendered app: three.js canvas + agm-map element."""
import json, os, re, subprocess, sys, time, socket
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, '.verification-evidence', 'angular-maps')
CHROME = os.environ.get('CHROME_PATH', '/usr/bin/google-chrome')
failures = []
def check(name, cond, detail=''):
    print(('PASS' if cond else 'FAIL'), name, detail)
    if not cond: failures.append(name)
os.makedirs(OUT, exist_ok=True)
# 1. production build
r = subprocess.run(['npx', 'ng', 'build'], cwd=ROOT, capture_output=True, text=True, timeout=600)
open(os.path.join(OUT, 'build.log'), 'w').write(r.stdout + r.stderr)
dist = None
for base, _, _ in os.walk(os.path.join(ROOT, 'dist')):
    if os.path.exists(os.path.join(base, 'index.html')): dist = base; break
check('ng-build', r.returncode == 0 and bool(dist), dist or r.stdout[-200:])
if not dist: print('FAILURES=%d' % len(failures)); sys.exit(1)
# 2. serve + headless render
s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--directory', dist, '--bind', '127.0.0.1'],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    time.sleep(1.0)
    url = 'http://127.0.0.1:%d/' % port
    for width, tag in [(390, 'mobile'), (1365, 'desktop')]:
        shot = os.path.join(OUT, f'{tag}.png')
        r = subprocess.run([CHROME, '--headless=new', '--no-sandbox', '--disable-gpu',
                            '--use-angle=swiftshader-webgl', '--virtual-time-budget=8000',
                            f'--window-size={width},900', f'--screenshot={shot}', url],
                           capture_output=True, text=True, timeout=120)
        check(f'render-{tag}', r.returncode == 0 and os.path.exists(shot) and os.path.getsize(shot) > 2000)
    r = subprocess.run([CHROME, '--headless=new', '--no-sandbox', '--disable-gpu',
                        '--use-angle=swiftshader-webgl', '--virtual-time-budget=8000', '--dump-dom', url],
                       capture_output=True, text=True, timeout=120)
    dom = r.stdout
    open(os.path.join(OUT, 'dom.html'), 'w').write(dom)
    check('three-canvas', 'data-engine="three.js' in dom)
    check('agm-map-present', 'agm-map' in dom)
    check('app-booted', '<my-app' in dom and len(dom) > 3000, f'{len(dom)} bytes')
    # Google Maps JS API needs a real key; record whether it was attempted
    m = re.findall(r'maps\.googleapis\.com[^\s"\']*', dom)
    json.dump({'googleMapsKeyPlaceholder': 'YOUR_PLACEHOLDER_API_KEY' in open(os.path.join(ROOT, 'src/app/app.module.ts')).read(),
               'mapsApiRefsInDom': m[:3]}, open(os.path.join(OUT, 'maps-boundary.json'), 'w'), indent=2)
finally:
    srv.terminate(); srv.wait()
print('FAILURES=%d' % len(failures))
sys.exit(0 if not failures else 1)
