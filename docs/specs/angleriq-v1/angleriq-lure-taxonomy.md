🎣 AnglerIQ — Canonical Lure Category System (V1)

This is the official, non-drifting, locked list of all lure categories used across:

Pattern engine (Pro / Elite / Vision)

SAGE advisory layer

Control Center personalization

UI components

Future recommendation weighting (confidence baits, banned techniques)

Every assistant, every chat, every future feature must reference this list.

🟦 1. POWER FISHING LURES
Moving / Reaction

Chatterbait

Spinnerbait

Buzzbait

Swim jig

Squarebill crankbait

Mid-depth crankbait

Deep crankbait

Lipless crankbait

Underspin

Swimbait (paddle tail)

Glide bait

Topwater (power-oriented)

Walking bait (Spook-style)

Whopper Plopper

Prop bait

Wakebait

🟩 2. FINESSE LURES
Soft plastic finesse

Ned rig

Wacky rig

Dropshot

Finesse swimbait

Neko rig

Shaky head

Split-shot rig

Flick shake

Finesse jigs

Finesse jig

Micro-jig

🟧 3. BOTTOM-CONTACT / JIG & TEXAS RIG FAMILY
Jigs

Football jig

Casting jig

Flipping/punch jig

Swim jig (cross-listed with power, but belongs here too)

Texas-rig & soft plastics

Texas-rig worm

Texas creature bait

Carolina rig

Jighead worm

Lizard

Craw / beaver presentations

🟥 4. TOPWATER FAMILY

(Separate category from Power Fishing for clarity)

Walking bait

Popper

Frog (hollow body)

Frog (soft plastic – buzzing frog)

Prop bait

Whopper Plopper

Wakebait

🟪 5. JERKBAITS / MINNOW BAITS

Hard jerkbait

Soft jerkbait (Fluke-style)

Suspending jerkbait

Deep jerkbait

🟫 6. VERTICAL / DEEP-WATER

Blade bait

Jigging spoon

Flutter spoon

Damiki rig

Ice-style micro jigs (rare for bass but included for completeness)

Drop-shot (cross-listed finesse)

🟨 7. SPECIALTY PRESENTATIONS

Alabama rig (A-Rig)

Hair jig

In-line spinner (rare but valid)

Scrounger head

🟦 8. SOFT SWIMBAITS / LINE-THROUGH

Line-through swimbait

Soft wedge tail swimbait

Multi-joint soft swimbaits

🟩 9. CREATURES / CRAW SELECTORS

(This overlaps Texas-rig + jig trailers, but exists as its own semantic category)

Creature bait (BB Cricket, Brush Hog)

Craw trailer

Chunk trailer

Beaver-style bait

🟥 10. LIVE BAIT (Not used in patterns, but included for future expansion)

Live shiners

Live nightcrawlers

Live minnows

🎣 Category Map for Smart Search

To make the other chat smarter, here is the flattened set it can treat as canonical answer tokens:

[
"chatterbait", "spinnerbait", "buzzbait", "swim jig",
"squarebill", "mid-depth crankbait", "deep crankbait",
"lipless crankbait", "underspin", "swimbait", "glide bait",
"walking bait", "whopper plopper", "prop bait", "wakebait",

"ned rig", "wacky rig", "dropshot", "finesse swimbait",
"neko rig", "shaky head", "split-shot rig", "flick shake",
"finesse jig", "micro-jig",

"football jig", "casting jig", "flipping jig",
"texas-rig worm", "carolina rig", "creature bait",
"craw trailer", "beaver bait",

"popper", "frog", "buzzing frog",

"jerkbait", "soft jerkbait", "suspending jerkbait",
"deep jerkbait",

"blade bait", "jigging spoon", "flutter spoon", "damiki rig",

"alabama rig", "hair jig", "inline spinner", "scrounger head",

"line-through swimbait", "soft swimbait", "multi-joint swimbait",

"live shiner", "live worm", "live minnow"
]
