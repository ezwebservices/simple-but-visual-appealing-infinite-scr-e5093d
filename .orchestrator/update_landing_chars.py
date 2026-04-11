"""Regenerate the 8 character SVGs in landing/index.html so each pal is a
distinct animal (bear/fox/bunny/frog/panda/robot). Palettes and decoration
shapes are kept in lockstep with src/components/characters/CharacterRig.tsx."""

PALETTES = {
    'sunny': {  # FOX — warm orange
        'body':  ['#FFEDE0', '#FFD0BC', '#F4A48E', '#E2806A', '#C95F4A'],
        'belly': ['#FFF8E5', '#FCEDC4', '#F5DA9A', '#E8C57A'],
        'iris':  ['#1A0F08', '#3D2818', '#7A4F2C'],
    },
    'rosie': {  # BUNNY — soft pink (re-paletted from purple)
        'body':  ['#FFF0F4', '#FFD8E2', '#FFB8CC', '#F594B0', '#E07898'],
        'belly': ['#FFFAFC', '#FFEEF2', '#FFDCE5', '#F5B8C8'],
        'iris':  ['#1A0820', '#3D1F2A', '#9D5870'],
    },
    'milo': {  # FROG — fresh green
        'body':  ['#E8FBE8', '#C8F0CC', '#A2DCA8', '#7BC587', '#5BA868'],
        'belly': ['#F8FFE8', '#EFFAC8', '#E0F098', '#C8DD78'],
        'iris':  ['#0A1A05', '#1F4A1A', '#5A8C45'],
    },
    'pip': {  # PANDA — grayscale white
        'body':  ['#FAFCFF', '#EFF1F5', '#DFE3EA', '#C5CCD6', '#A8B0BC'],
        'belly': ['#FFFFFF', '#F5F7FA', '#E5E9F0', '#C5CCD6'],
        'iris':  ['#0A0A12', '#1F1F2A', '#525266'],
    },
    'rex': {  # ROBOT — cyan
        'body':  ['#E0F8FE', '#BDEEFB', '#94DEF0', '#6DC8DD', '#54B3C8'],
        'belly': ['#F0FCFF', '#D8F4FA', '#B8E8F2', '#90D2E0'],
        'iris':  ['#0A1F2A', '#1F3D4A', '#52788C'],
    },
}

# ─── Per-animal decorations ────────────────────────────────────────────────
# EARS — replaces the default bear-ear block. Varies per animal.
EARS = {
    'sunny': lambda p: (
        # FOX — narrow pointed ears with bases embedded inside the head so
        # they peek out from BEHIND the head silhouette (the head ellipse
        # is drawn after char-ears, so the base is hidden and only the
        # upper portion is visible).
        '<path d="M118,60 Q102,30 116,4 Q138,24 148,60 Z" fill="url(#{prefix}-body)"/>'
        '<path d="M122,56 Q112,32 118,12 Q134,28 142,56 Z" fill="url(#{prefix}-belly)"/>'
        '<path d="M114,18 Q116,4 122,10 Q120,20 116,24 Z" fill="#3D1810" opacity="0.9"/>'
        '<path d="M202,60 Q218,30 204,4 Q182,24 172,60 Z" fill="url(#{prefix}-body)"/>'
        '<path d="M198,56 Q208,32 202,12 Q186,28 178,56 Z" fill="url(#{prefix}-belly)"/>'
        '<path d="M206,18 Q204,4 198,10 Q200,20 204,24 Z" fill="#3D1810" opacity="0.9"/>'
    ),
    'rosie': lambda p: (
        # BUNNY — long upright pink-lined oval ears
        '<ellipse cx="100" cy="40" rx="16" ry="50" fill="url(#{prefix}-body)" transform="rotate(-8 100 40)"/>'
        '<ellipse cx="100" cy="42" rx="9" ry="40" fill="#FFD2DE" transform="rotate(-8 100 42)"/>'
        '<ellipse cx="100" cy="32" rx="5" ry="28" fill="#FFB8CC" transform="rotate(-8 100 32)" opacity="0.7"/>'
        '<ellipse cx="220" cy="40" rx="16" ry="50" fill="url(#{prefix}-body)" transform="rotate(8 220 40)"/>'
        '<ellipse cx="220" cy="42" rx="9" ry="40" fill="#FFD2DE" transform="rotate(8 220 42)"/>'
        '<ellipse cx="220" cy="32" rx="5" ry="28" fill="#FFB8CC" transform="rotate(8 220 32)" opacity="0.7"/>'
    ),
    'milo': lambda p: (
        # FROG — small green eye-bump pads + crest spots (no side ears)
        '<ellipse cx="120" cy="48" rx="14" ry="10" fill="url(#{prefix}-body)"/>'
        '<ellipse cx="116" cy="44" rx="6" ry="4" fill="url(#{prefix}-sheen)"/>'
        '<ellipse cx="200" cy="48" rx="14" ry="10" fill="url(#{prefix}-body)"/>'
        '<ellipse cx="196" cy="44" rx="6" ry="4" fill="url(#{prefix}-sheen)"/>'
        f'<circle cx="160" cy="42" r="4" fill="{p["body"][3]}" opacity="0.8"/>'
        f'<circle cx="148" cy="46" r="3" fill="{p["body"][3]}" opacity="0.6"/>'
        f'<circle cx="172" cy="46" r="3" fill="{p["body"][3]}" opacity="0.6"/>'
    ),
    'pip': lambda p: (
        # PANDA — round black ears planted on the head corners with enough
        # size + overlap that they read clearly as panda ears.
        '<circle cx="90" cy="62" r="26" fill="#1A1A22"/>'
        '<circle cx="90" cy="62" r="17" fill="#2A2A38" opacity="0.6"/>'
        '<circle cx="85" cy="54" r="7" fill="#3D3D4A" opacity="0.85"/>'
        '<circle cx="230" cy="62" r="26" fill="#1A1A22"/>'
        '<circle cx="230" cy="62" r="17" fill="#2A2A38" opacity="0.6"/>'
        '<circle cx="225" cy="54" r="7" fill="#3D3D4A" opacity="0.85"/>'
    ),
    'rex': lambda p: (
        # ROBOT — square satellite-dish "ears"
        '<rect x="56" y="100" width="20" height="36" rx="3" fill="url(#{prefix}-body)"/>'
        f'<rect x="60" y="106" width="12" height="6" rx="1" fill="{p["iris"][1]}" opacity="0.7"/>'
        '<circle cx="66" cy="124" r="3" fill="#FFD93D"/>'
        '<rect x="244" y="100" width="20" height="36" rx="3" fill="url(#{prefix}-body)"/>'
        f'<rect x="248" y="106" width="12" height="6" rx="1" fill="{p["iris"][1]}" opacity="0.7"/>'
        '<circle cx="254" cy="124" r="3" fill="#FFD93D"/>'
    ),
}

# HEAD_OVERLAY — drawn AFTER head ellipse and BEFORE cheeks (eye patches, etc.)
HEAD_OVERLAYS = {
    'sunny': lambda p: (
        # FOX — white snout mask
        '<path d="M120,150 Q160,200 200,150 Q200,180 160,200 Q120,180 120,150 Z" fill="#FFFAEC" opacity="0.85"/>'
    ),
    'rosie': lambda p: '',
    'milo':  lambda p: '',
    'pip':   lambda p: (
        # PANDA — dark eye patches behind the eyes
        '<ellipse cx="120" cy="135" rx="32" ry="34" fill="#1A1A22" transform="rotate(-12 120 135)"/>'
        '<ellipse cx="200" cy="135" rx="32" ry="34" fill="#1A1A22" transform="rotate(12 200 135)"/>'
    ),
    'rex':   lambda p: '',
}

# BODY_ACCENT — belly mark (heart for bear, white belly for fox, etc.)
BODY_ACCENTS = {
    'sunny': lambda p: (
        # FOX — white belly patch + chest fluff
        '<ellipse cx="160" cy="252" rx="32" ry="28" fill="#FFFAEC" opacity="0.7"/>'
        '<path d="M148,228 Q160,222 172,228 Q170,236 160,238 Q150,236 148,228 Z" fill="#FFFFFF" opacity="0.85"/>'
    ),
    'rosie': lambda p: (
        # BUNNY — small white flower
        '<circle cx="160" cy="240" r="3.5" fill="#FFD93D"/>'
        '<circle cx="155" cy="236" r="3" fill="#FFFFFF"/>'
        '<circle cx="165" cy="236" r="3" fill="#FFFFFF"/>'
        '<circle cx="155" cy="244" r="3" fill="#FFFFFF"/>'
        '<circle cx="165" cy="244" r="3" fill="#FFFFFF"/>'
    ),
    'milo': lambda p: (
        # FROG — darker spots on belly
        f'<circle cx="142" cy="245" r="4" fill="{p["body"][4]}" opacity="0.6"/>'
        f'<circle cx="178" cy="245" r="4" fill="{p["body"][4]}" opacity="0.6"/>'
        f'<circle cx="160" cy="262" r="3.5" fill="{p["body"][4]}" opacity="0.6"/>'
    ),
    'pip': lambda p: (
        # PANDA — black tummy patch (iconic panda body mark)
        '<ellipse cx="160" cy="248" rx="42" ry="38" fill="#1A1A22" opacity="0.92"/>'
        '<ellipse cx="155" cy="240" rx="22" ry="14" fill="#3D3D4A" opacity="0.4"/>'
    ),
    'rex': lambda p: (
        # ROBOT — chest panel with indicator lights
        f'<rect x="142" y="225" width="36" height="22" rx="4" fill="{p["iris"][1]}" opacity="0.6"/>'
        '<circle cx="152" cy="236" r="2" fill="#FFD93D"/>'
        '<circle cx="160" cy="236" r="2" fill="#FF6B6B"/>'
        '<circle cx="168" cy="236" r="2" fill="#4ECDC4"/>'
    ),
}

# MOUTH_ACCENT — drawn over the default smile
MOUTH_ACCENTS = {
    'sunny': lambda p: (
        # FOX — slim snout outline
        '<path d="M150,168 Q160,178 170,168" fill="none" stroke="#3D1810" stroke-width="1.2" opacity="0.7"/>'
    ),
    'rosie': lambda p: (
        # BUNNY — two front teeth
        '<rect x="156" y="183" width="3.5" height="6" rx="0.8" fill="#FFFFFF" stroke="#3D2818" stroke-width="0.5"/>'
        '<rect x="160.5" y="183" width="3.5" height="6" rx="0.8" fill="#FFFFFF" stroke="#3D2818" stroke-width="0.5"/>'
    ),
    'milo': lambda p: (
        # FROG — extra-wide mouth replacing the smile
        '<path d="M120,176 Q160,200 200,176" fill="none" stroke="#1A0F08" stroke-width="4" stroke-linecap="round"/>'
        '<circle cx="135" cy="180" r="2" fill="#1A0F08" opacity="0.7"/>'
        '<circle cx="185" cy="180" r="2" fill="#1A0F08" opacity="0.7"/>'
    ),
    'pip': lambda p: '',
    'rex': lambda p: (
        # ROBOT — grille mouth
        '<rect x="148" y="180" width="24" height="6" rx="1" fill="#1F3D4A" opacity="0.8"/>'
        f'<line x1="152" y1="180" x2="152" y2="186" stroke="{p["body"][0]}" stroke-width="0.8"/>'
        f'<line x1="156" y1="180" x2="156" y2="186" stroke="{p["body"][0]}" stroke-width="0.8"/>'
        f'<line x1="160" y1="180" x2="160" y2="186" stroke="{p["body"][0]}" stroke-width="0.8"/>'
        f'<line x1="164" y1="180" x2="164" y2="186" stroke="{p["body"][0]}" stroke-width="0.8"/>'
        f'<line x1="168" y1="180" x2="168" y2="186" stroke="{p["body"][0]}" stroke-width="0.8"/>'
    ),
}

# HEAD_ACCENT — drawn above head (antenna, etc.)
HEAD_ACCENTS = {
    'sunny': lambda p: '',
    'rosie': lambda p: '',
    'milo':  lambda p: '',
    'pip':   lambda p: '',
    'rex':   lambda p: (
        '<line x1="160" y1="44" x2="160" y2="20" stroke="#2C7388" stroke-width="2.5"/>'
        '<circle cx="160" cy="16" r="6" fill="#FF6B6B"/>'
    ),
}


def make_svg(prefix, palette_key):
    p = PALETTES[palette_key]
    ears         = EARS[palette_key](p).replace('{prefix}', prefix)
    head_overlay = HEAD_OVERLAYS[palette_key](p).replace('{prefix}', prefix)
    body_accent  = BODY_ACCENTS[palette_key](p).replace('{prefix}', prefix)
    mouth_accent = MOUTH_ACCENTS[palette_key](p).replace('{prefix}', prefix)
    head_accent  = HEAD_ACCENTS[palette_key](p).replace('{prefix}', prefix)
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
        f'                {body_accent}\n'
        '              </g>\n'
        '              <g class="h-head" style="transform-origin:160px 200px">\n'
        f'                {ears}\n'
        f'                <ellipse cx="160" cy="130" rx="92" ry="86" fill="url(#{prefix}-body)"/>\n'
        f'                <ellipse cx="135" cy="95" rx="58" ry="40" fill="url(#{prefix}-sheen)"/>\n'
        '                <ellipse cx="125" cy="75" rx="28" ry="11" fill="white" opacity="0.32"/>\n'
        f'                {head_overlay}\n'
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
        f'                {mouth_accent}\n'
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
s = replace_svg_at_marker(s, 'id="hs-body"', make_svg('hs', 'sunny'))
s = replace_svg_at_marker(s, 'id="hr-body"', make_svg('hr', 'rosie'))
s = replace_svg_at_marker(s, 'id="hm-body"', make_svg('hm', 'milo'))

print('Meet the Pals dancers...')
s = replace_svg_at_marker(s, 'id="sb-body"', make_svg('sb', 'sunny'))
s = replace_svg_at_marker(s, 'id="ro-body"', make_svg('ro', 'rosie'))
s = replace_svg_at_marker(s, 'id="mf-body"', make_svg('mf', 'milo'))
s = replace_svg_at_marker(s, 'id="pz-body"', make_svg('pz', 'pip'))
s = replace_svg_at_marker(s, 'id="rx-body"', make_svg('rx', 'rex'))

with open('landing/index.html', 'w', encoding='utf-8') as f:
    f.write(s)
print('done')
