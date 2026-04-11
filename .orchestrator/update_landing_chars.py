"""One-shot script: replace 8 character SVGs in landing/index.html
with the new polished design (matches CharacterRig.tsx)."""

PALETTES = {
    'sunny': {
        'body':  ['#FFEDE0', '#FFD0BC', '#F4A48E', '#E2806A', '#C95F4A'],
        'belly': ['#FFF8E5', '#FCEDC4', '#F5DA9A', '#E8C57A'],
        'iris':  ['#1A0F08', '#3D2818', '#7A4F2C'],
    },
    'rosie': {
        'body':  ['#F5E5FB', '#E5C8F0', '#CFA8E0', '#B689CC', '#9D6FB5'],
        'belly': ['#FFF6F8', '#FBE3EC', '#F5C9D8', '#E8AABC'],
        'iris':  ['#1A0820', '#3D1F4A', '#7A4F8C'],
    },
    'milo': {
        'body':  ['#E8FBE8', '#C8F0CC', '#A2DCA8', '#7BC587', '#5BA868'],
        'belly': ['#F8FFE8', '#EFFAC8', '#E0F098', '#C8DD78'],
        'iris':  ['#0A1A05', '#1F4A1A', '#5A8C45'],
    },
    'pip': {
        'body':  ['#FAFCFF', '#EFF1F5', '#DFE3EA', '#C5CCD6', '#A8B0BC'],
        'belly': ['#FFFFFF', '#F5F7FA', '#E5E9F0', '#C5CCD6'],
        'iris':  ['#0A0A12', '#1F1F2A', '#525266'],
    },
    'rex': {
        'body':  ['#E0F8FE', '#BDEEFB', '#94DEF0', '#6DC8DD', '#54B3C8'],
        'belly': ['#F0FCFF', '#D8F4FA', '#B8E8F2', '#90D2E0'],
        'iris':  ['#0A1F2A', '#1F3D4A', '#52788C'],
    },
}

ACCENTS = {
    'sunny': '<circle cx="142" cy="232" r="4" fill="#2A1810" opacity="0.7"/><circle cx="178" cy="232" r="4" fill="#2A1810" opacity="0.7"/><circle cx="160" cy="252" r="3.5" fill="#2A1810" opacity="0.7"/>',
    'rosie': '',
    'milo':  '',
    'pip':   '<path d="M130,225 Q160,221 190,225" stroke="#2A2A38" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M125,245 Q160,242 195,245" stroke="#2A2A38" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M130,265 Q160,268 190,265" stroke="#2A2A38" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>',
    'rex':   '<rect x="142" y="225" width="36" height="22" rx="4" fill="#1F3D4A" opacity="0.6"/><circle cx="152" cy="236" r="2" fill="#FFD93D"/><circle cx="160" cy="236" r="2" fill="#FF6B6B"/><circle cx="168" cy="236" r="2" fill="#4ECDC4"/>',
}

HEAD_ACCENTS = {
    'sunny': '',
    'rosie': '',
    'milo':  '',
    'pip':   '',
    'rex':   '<line x1="160" y1="44" x2="160" y2="20" stroke="#2C7388" stroke-width="2.5"/><circle cx="160" cy="16" r="6" fill="#FF6B6B"/>',
}


def make_svg(prefix, palette_key):
    p = PALETTES[palette_key]
    accent = ACCENTS[palette_key]
    head_accent = HEAD_ACCENTS[palette_key]
    return (
        '<svg viewBox="0 0 320 380" style="width:100%;height:100%">\n'
        '              <defs>\n'
        f'                <radialGradient id="{prefix}-body" cx="42%" cy="32%" r="80%">\n'
        f'                  <stop offset="0%" stop-color="{p["body"][0]}"/><stop offset="30%" stop-color="{p["body"][1]}"/>\n'
        f'                  <stop offset="65%" stop-color="{p["body"][2]}"/><stop offset="90%" stop-color="{p["body"][3]}"/><stop offset="100%" stop-color="{p["body"][4]}"/>\n'
        '                </radialGradient>\n'
        f'                <radialGradient id="{prefix}-belly" cx="50%" cy="40%" r="70%">\n'
        f'                  <stop offset="0%" stop-color="{p["belly"][0]}"/><stop offset="50%" stop-color="{p["belly"][1]}"/>\n'
        f'                  <stop offset="90%" stop-color="{p["belly"][2]}"/><stop offset="100%" stop-color="{p["belly"][3]}"/>\n'
        '                </radialGradient>\n'
        f'                <radialGradient id="{prefix}-iris" cx="50%" cy="50%" r="50%">\n'
        f'                  <stop offset="0%" stop-color="{p["iris"][0]}"/><stop offset="55%" stop-color="{p["iris"][1]}"/><stop offset="100%" stop-color="{p["iris"][2]}"/>\n'
        '                </radialGradient>\n'
        f'                <radialGradient id="{prefix}-cheek" cx="50%" cy="50%" r="50%">\n'
        '                  <stop offset="0%" stop-color="#FFB3C1" stop-opacity="0.85"/>\n'
        '                  <stop offset="100%" stop-color="#FFB3C1" stop-opacity="0"/>\n'
        '                </radialGradient>\n'
        f'                <radialGradient id="{prefix}-sheen" cx="35%" cy="22%" r="55%">\n'
        '                  <stop offset="0%" stop-color="white" stop-opacity="0.35"/>\n'
        '                  <stop offset="100%" stop-color="white" stop-opacity="0"/>\n'
        '                </radialGradient>\n'
        '              </defs>\n'
        '              <ellipse cx="160" cy="358" rx="80" ry="9" fill="black" opacity="0.18"/>\n'
        '              <g class="h-left-leg" style="transform-origin:138px 280px">\n'
        f'                <path d="M118,270 Q114,290 116,310 Q118,328 124,338 Q116,348 124,355 Q138,360 152,355 Q160,348 152,338 Q158,328 160,310 Q162,290 158,270 Q138,262 118,270 Z" fill="url(#{prefix}-body)"/>\n'
        f'                <path d="M124,348 Q138,358 152,348 Q150,355 138,357 Q126,355 124,348 Z" fill="url(#{prefix}-belly)"/>\n'
        '              </g>\n'
        '              <g class="h-right-leg" style="transform-origin:182px 280px">\n'
        f'                <path d="M162,270 Q158,290 160,310 Q162,328 168,338 Q160,348 168,355 Q182,360 196,355 Q204,348 196,338 Q202,328 204,310 Q206,290 202,270 Q182,262 162,270 Z" fill="url(#{prefix}-body)"/>\n'
        f'                <path d="M168,348 Q182,358 196,348 Q194,355 182,357 Q170,355 168,348 Z" fill="url(#{prefix}-belly)"/>\n'
        '              </g>\n'
        '              <g class="h-torso" style="transform-origin:160px 240px">\n'
        f'                <ellipse cx="160" cy="240" rx="68" ry="58" fill="url(#{prefix}-body)"/>\n'
        f'                <ellipse cx="142" cy="222" rx="42" ry="32" fill="url(#{prefix}-sheen)"/>\n'
        f'                <ellipse cx="160" cy="248" rx="44" ry="42" fill="url(#{prefix}-belly)"/>\n'
        f'                {accent}\n'
        '              </g>\n'
        '              <g class="h-head" style="transform-origin:160px 200px">\n'
        f'                <path d="M92,38 C72,38 65,55 70,72 C74,84 88,90 92,90 C96,90 110,84 114,72 C119,55 112,38 92,38 Z" fill="url(#{prefix}-body)"/>\n'
        f'                <path d="M92,55 C82,55 78,65 81,75 C84,82 90,86 92,86 C94,86 100,82 103,75 C106,65 102,55 92,55 Z" fill="url(#{prefix}-belly)"/>\n'
        '                <ellipse cx="92" cy="74" rx="6" ry="8" fill="#A87530" opacity="0.45"/>\n'
        f'                <path d="M228,38 C208,38 201,55 206,72 C210,84 224,90 228,90 C232,90 246,84 250,72 C255,55 248,38 228,38 Z" fill="url(#{prefix}-body)"/>\n'
        f'                <path d="M228,55 C218,55 214,65 217,75 C220,82 226,86 228,86 C230,86 236,82 239,75 C242,65 238,55 228,55 Z" fill="url(#{prefix}-belly)"/>\n'
        '                <ellipse cx="228" cy="74" rx="6" ry="8" fill="#A87530" opacity="0.45"/>\n'
        f'                <ellipse cx="160" cy="130" rx="92" ry="86" fill="url(#{prefix}-body)"/>\n'
        f'                <ellipse cx="135" cy="95" rx="58" ry="40" fill="url(#{prefix}-sheen)"/>\n'
        '                <ellipse cx="125" cy="75" rx="28" ry="11" fill="white" opacity="0.32"/>\n'
        f'                {head_accent}\n'
        f'                <circle cx="80" cy="155" r="22" fill="url(#{prefix}-cheek)"/>\n'
        f'                <circle cx="240" cy="155" r="22" fill="url(#{prefix}-cheek)"/>\n'
        f'                <ellipse cx="160" cy="160" rx="42" ry="30" fill="url(#{prefix}-belly)"/>\n'
        '                <ellipse cx="155" cy="152" rx="22" ry="14" fill="white" opacity="0.3"/>\n'
        '                <ellipse cx="120" cy="130" rx="23" ry="27" fill="#3D2818" opacity="0.4"/>\n'
        '                <ellipse cx="120" cy="130" rx="22" ry="26" fill="#FFFFFF"/>\n'
        f'                <circle cx="120" cy="135" r="18" fill="url(#{prefix}-iris)"/>\n'
        '                <circle cx="120" cy="136" r="6" fill="#0A0500"/>\n'
        '                <ellipse cx="125" cy="127" rx="8" ry="6" fill="white"/>\n'
        '                <circle cx="114" cy="143" r="3" fill="white" opacity="0.9"/>\n'
        '                <ellipse cx="200" cy="130" rx="23" ry="27" fill="#3D2818" opacity="0.4"/>\n'
        '                <ellipse cx="200" cy="130" rx="22" ry="26" fill="#FFFFFF"/>\n'
        f'                <circle cx="200" cy="135" r="18" fill="url(#{prefix}-iris)"/>\n'
        '                <circle cx="200" cy="136" r="6" fill="#0A0500"/>\n'
        '                <ellipse cx="205" cy="127" rx="8" ry="6" fill="white"/>\n'
        '                <circle cx="194" cy="143" r="3" fill="white" opacity="0.9"/>\n'
        '                <ellipse cx="160" cy="168" rx="7" ry="5" fill="#1A0F08"/>\n'
        '                <ellipse cx="160" cy="167" rx="6" ry="4" fill="#3D2818"/>\n'
        '                <ellipse cx="158" cy="165" rx="2.5" ry="1.5" fill="white" opacity="0.7"/>\n'
        '                <path d="M148,180 Q160,193 172,180" fill="none" stroke="#1A0F08" stroke-width="3.5" stroke-linecap="round"/>\n'
        '              </g>\n'
        '              <g class="h-left-arm" style="transform-origin:108px 218px">\n'
        f'                <path d="M108,196 Q132,196 134,222 Q138,250 132,276 Q140,298 122,308 Q108,314 94,308 Q76,298 84,276 Q78,250 82,222 Q84,196 108,196 Z" fill="url(#{prefix}-body)"/>\n'
        f'                <path d="M94,295 Q108,306 122,295 Q122,304 108,308 Q94,304 94,295 Z" fill="url(#{prefix}-belly)"/>\n'
        '              </g>\n'
        '              <g class="h-right-arm" style="transform-origin:212px 218px">\n'
        f'                <path d="M212,196 Q236,196 238,222 Q242,250 236,276 Q244,298 226,308 Q212,314 198,308 Q180,298 188,276 Q182,250 186,222 Q188,196 212,196 Z" fill="url(#{prefix}-body)"/>\n'
        f'                <path d="M198,295 Q212,306 226,295 Q226,304 212,308 Q198,304 198,295 Z" fill="url(#{prefix}-belly)"/>\n'
        '              </g>\n'
        '            </svg>'
    )


def replace_svg_at_marker(content, marker, new_svg):
    idx = content.find(marker)
    if idx < 0:
        print(f'  ! marker not found: {marker}')
        return content
    svg_start = content.rfind('<svg', 0, idx)
    if svg_start < 0:
        print(f'  ! no <svg before marker {marker}')
        return content
    svg_end = content.find('</svg>', idx) + len('</svg>')
    if svg_end < len('</svg>'):
        print(f'  ! no </svg> after marker {marker}')
        return content
    print(f'  ok {marker} (replaced {svg_end - svg_start} chars)')
    return content[:svg_start] + new_svg + content[svg_end:]


with open('landing/index.html', 'r', encoding='utf-8') as f:
    s = f.read()

print('Hero dancers...')
s = replace_svg_at_marker(s, 'id="hs-shell"', make_svg('hs', 'sunny'))
s = replace_svg_at_marker(s, 'id="hr-body"', make_svg('hr', 'rosie'))
s = replace_svg_at_marker(s, 'id="hm-body"', make_svg('hm', 'milo'))

print('Meet the Pals dancers...')
s = replace_svg_at_marker(s, 'id="sb-shell"', make_svg('sb', 'sunny'))
s = replace_svg_at_marker(s, 'id="ro-body"', make_svg('ro', 'rosie'))
s = replace_svg_at_marker(s, 'id="mf-body"', make_svg('mf', 'milo'))
s = replace_svg_at_marker(s, 'id="pz-body"', make_svg('pz', 'pip'))
s = replace_svg_at_marker(s, 'id="rx-body"', make_svg('rx', 'rex'))

with open('landing/index.html', 'w', encoding='utf-8') as f:
    f.write(s)
print('done')
