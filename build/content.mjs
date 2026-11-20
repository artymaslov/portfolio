/* All site copy in one place.
   Facts come only from content/*.json and Artem's own brief.
   Anything unverified is marked [TODO: ...] and renders as a visible pending token. */

export const site = {
  origin: 'https://artmaslov.com',
  name: 'Artem Maslov',
  role: 'Creative Technologist & Art Director',
  place: 'Edmonton, Alberta',
  coords: '53.5461° N, 113.4938° W',
  email: 'artem@artmaslov.com',
  linkedin: 'https://www.linkedin.com/in/maslov-artem/',
  github: 'https://github.com/artymaslov',
  /* Google Analytics 4. Set to '' to take the tag off every page. */
  analytics: 'G-JZVL010GEG'
};

/* The statement. Four sentences, first person, no hype: what I do, what I have
   done it on, and what I am open to. It runs in the band at the top of the home
   page, it is the dialog behind it, and its first sentence is that page's meta
   description \u2014 so sentence one has to stand on its own. */
/* The meta descriptions, written rather than borrowed from the first line of
   something else: these are what a search result and a pasted link show, and
   155 characters is where both stop reading. */
export const meta = {
  home: 'Art director and creative technologist. I art-direct images and build the systems that make them — keeping the look intact where technology pushes back.',
  work: 'Selected client work in AI video, 3D, AR and immersive production, art-directed and built. Seven projects, two of them self-initiated R&D.',
  about: 'Artem Maslov, art director and creative technologist in Edmonton. Nine years across AR, 3D and AI, and the systems that hold a look. Open to work.'
};

export const statement = [
  { t: 'I art-direct images and build the systems that make them \u2014 keeping the look intact where the technology pushes back.' },
  { t: 'Nine years across AR, 3D and AI for Snap, Universal Pictures, Paramount Animation, Dior and Visit Dubai.' },
  { t: 'Open to full-time Art Director / Creative Technologist roles and select freelance projects.' },
  { t: 'Based in Edmonton, open to relocation.' }
];

/* The reel. One file, cut by Artem, silent by construction — it carries no audio
   track at all, so nothing on the home page can make a sound. It is the only
   media that page carries, and it sits under the statement as its evidence. */
export const reel = {
  video: '/assets/media/reel/reel.mp4',
  poster: '/assets/media/reel/poster.webp',
  ratio: '16/9',
  year: '2026',
  length: '0:22',   /* what the player's own counter says, floored, not rounded up from 22.6 */
  caption: 'Brand R&D, 3D and AR, cut from the work below.',
  /* What is on screen, and when. Each row is [timecode, project], and a third
     element links it to a page here: ['0:04', 'Pavilion', '/work/pavilion/'].
     The strip renders only once there is something in this list, so the reel
     reads as finished rather than as a component waiting for its data. */
  marks: []
};

export const projects = [
  {
    slug: 'pavilion',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: 'Product, engineering, art direction',
    title: 'Pavilion — Jewellery Imaging Studio',
    tagline: 'Catalog photography for jewelers who only have a phone and a workbench.',
    client: 'Pavilion ERP',
    role: 'Product design and build',
    year: '2026',
    disciplines: 'Product, AI pipeline, art direction',
    made: 'hand machine',
    note: 'A phone snapshot in, a catalog image out, with the piece unchanged.',
    share: '/assets/media/pavilion/og-cover.jpg',
    thumb: { poster: '/assets/media/pavilion/thumb.webp' },
    heroCompare: {
      ratio: '1/1',
      max: '34rem',
      drag: 'drag to reveal the photograph it came from',
      beforeAlt: 'A pavé ring held in two fingers in a workshop, its center setting empty.',
      afterAlt: 'The same ring on white, straight on, with a round brilliant set in the center.',
      pairs: [
        { before: '/assets/media/pavilion/ba/hero-before.webp',
          after: '/assets/media/pavilion/ba/hero-after.webp',
          caption: 'Left is what the jeweler sends. Right is what goes in the catalog — the same ring, with a stone in a setting that was empty when the photograph was taken.' }
      ]
    },
    summary: [
      ['Made', 'A web tool that turns a bench photograph into a catalog frame: on white, square, and set to the margin and scale the catalog runs at.'],
      ['Needed', 'Jewelers shoot on a phone, in bench light. A catalog wants white, straight and unchanged — a stone a shade wider is a different price.'],
      ['Worth', 'A catalog shoot costs more than the tool does. Jewelers and custom workshops across the United States and Canada use it every day.']
    ],
    sections: [
      { h: 'What it has to get right', p: [
        'Retouching a photograph of a ring is not like retouching a photograph of a chair. The proportions are the product. A center stone drawn half a millimeter too wide, a pavé row with one stone too many, a prong that tapers the wrong way — any of those is a different piece, and in this trade the gap between two pieces that look alike runs to five hundred or a thousand dollars.',
        'So the job is not to make a nice picture. The job is to make a picture that is still the same piece. Nothing in the tool can certify that, so every result is shown beside the photograph it came from and the jeweler decides. Everything below is organized around that constraint, the failures included.'
      ] },
      { h: 'Three things it does', p: [
        'Three modes sit behind one upload.',
        'Set takes a finished piece and gives it the catalog treatment: straight on, lit, on white, gray, black or a background of your own, with the metal color kept or changed.',
        'Unset is the one jewelers actually came for. You photograph a semi-mount with nothing in it, lasso the empty seat, choose a cut, and the piece comes back finished.',
        'CleanUp does nothing but remove dust and scratches, which is most of the work on most days.'
      ], compare: {
        cols: 2,
        ratio: '1/1',
        drag: 'drag to reveal the photograph that went in',
        pairs: [
          { before: '/assets/media/pavilion/ba/set-ring-before.webp', after: '/assets/media/pavilion/ba/set-ring-after.webp',
            beforeAlt: 'A sapphire pavé band held between two fingers under workshop light.',
            afterAlt: 'The same band on white, straight on, every stone legible.',
            caption: 'Set. A band photographed in the hand, returned as a catalog frame.' },
          { before: '/assets/media/pavilion/ba/set-earrings-before.webp', after: '/assets/media/pavilion/ba/set-earrings-after.webp',
            beforeAlt: 'Two drop earrings on a gray display stand in a shop case.',
            afterAlt: 'The pair on white, matched and hung level.',
            caption: 'Set. The stand goes, and the two earrings are matched to each other.' },
          { before: '/assets/media/pavilion/ba/set-necklace-before.webp', after: '/assets/media/pavilion/ba/set-necklace-after.webp',
            beforeAlt: 'A yellow-diamond necklace laid on a gray cloth, lit flat.',
            afterAlt: 'The same necklace hung and framed as a catalog shot.',
            caption: 'Set, with necklace framing on. A necklace needs different framing from a ring, and the tool switches to it.' },
          { before: '/assets/media/pavilion/ba/unset-02-before.webp', after: '/assets/media/pavilion/ba/unset-02-after.webp',
            beforeAlt: 'A gold semi-mount held in the hand, four bare prongs and no stone.',
            afterAlt: 'The finished ring in profile on white, a step-cut stone in the prongs.',
            caption: 'Unset. Nothing was set in this ring. The jeweler never had to.' }
        ]
      } },
      { h: 'In use', p: [
        'The pilot went live in the summer of 2026, and in its first month it put out more than 21,000 images. That is the tool\'s own counter — images generated, not images that reached a catalog, and the distance between those two is the jeweler deciding. Pavilion put their customer base at 200 jewelers; what share of them this reaches is their figure to give, not mine.'
      ] },
      { h: 'How it is built', p: [
        'The whole backend is ComfyUI. Generation runs on Nano Banana, a general image model, with its settings tuned for this one job; around it is a chain of stock ComfyUI nodes — no custom nodes to maintain, which matters when the tool has to keep running without me.',
        'The front end is the part a jeweler sees: upload, mode, a lasso, a background, Generate. Everything the graph needs is inferred or chosen there, and nobody is asked to write a prompt.'
      ] },
      { h: 'The path through it', p: [
        'One photograph, kept across all three tabs, so switching modes does not mean uploading again. Background splits three ways: a color preset, an image of your own with a placement zone you mark, or a text prompt. Then Generate, a progress bar with honest status lines, and a gallery of everything you have already made, because the real workflow is tweak and regenerate, not get it right first time.'
      ], embed: {
        src: 'https://miro.com/app/live-embed/uXjVEOgL3cw=/?embedMode=view_only_without_ui&moveToViewport=808,31,901,901&embedId=81812414431',
        href: 'https://miro.com/app/board/uXjVEOgL3cw=/',
        host: 'Miro',
        title: 'Pavilion Jewellery Imaging Studio — user flow',
        cta: 'Load the interactive board',
        still: '/assets/media/pavilion/flow.webp',
        stillSmall: '/assets/media/pavilion/flow_t.webp',
        ratio: '3692/1083',
        alt: 'The user flow: login, upload, then the Set, CleanUp and Unset tabs, their options, the three kinds of background, Generate, and the preview gallery that loops back for another pass.',
        caption: 'The flow as a picture. The board behind it is live, and it loads only if you ask for it.'
      } },
      { h: 'Two decisions worth the argument', p: [
        'The first: the lasso. The obvious build detects the empty seat on its own, and mostly it can. But “mostly” is the wrong number when the output is a price-bearing image, so the jeweler draws the area and the model works inside it. Three seconds of work buys a guarantee about where the stone can appear.',
        'The second: necklace framing is a switch, not a guess. A necklace wants a different crop, a different hang and a different distance from a ring, and a model asked to work that out from the photograph gets it right until the day it does not. A toggle is boring, and it is always right.'
      ], clips: {
        cols: 2,
        ratio: '16/9',
        items: [
          { src: '/assets/media/pavilion/clips/lasso.mp4', alt: 'The empty seat of a ring is lassoed, the area fills in, and the finished ring comes back with a stone set.' },
          { src: '/assets/media/pavilion/clips/necklace.mp4', alt: 'A necklace is uploaded, necklace framing is switched on, and the crop changes to suit it.' }
        ]
      } },
      { h: 'The tool, end to end', p: [
        'Thirty seconds, no sound: a ring goes in, the metal is changed to rose, a background is picked, and the result comes back with a compare slider and three ways to download it.'
      ], film: {
        src: '/assets/media/pavilion/films/showreel.mp4',
        poster: '/assets/media/pavilion/films/showreel.webp',
        ratio: '1920/860'
      } },
      { h: 'What I changed my mind about', p: [
        'I started with the geometry handled in code — framing a necklace, placing a stone, squaring a ring — and the model left to do surface and light. Code is deterministic, and this is a job where determinism is the point.',
        'It was also slower and worse. Every piece of jewelry is a different shape, and the rules I wrote kept meeting a piece that broke them. What worked was moving the geometry into the prompt and the model settings, and spending the engineering on the parts where being wrong costs money: the lasso, the framing switch, the mode split. Code where it has to be exact, the model where it has to be general.'
      ] },
      { h: 'Where it falls over', p: [
        'It is not a solved problem, and this page should say so. The failures are consistent enough to name.',
        'A piece too small in the frame comes back invented. Long articulated things — tennis bracelets, chains — break where the model loses the run of the links, and it will drop a segment or add one. Props do not always leave cleanly, and a cut with hard geometry, emerald and pavé especially, is the first thing to drift when the source is soft.',
        'A jeweler catches all of these in a second, which is why every result sits next to its original in the interface and nothing is published without a look. The last two below have no original kept; they are left in for the same reason as the rest.'
      ], pairs: {
        cols: 2,
        ratio: '1/1',
        items: [
          { base: '/assets/media/pavilion/ba/miss-ring',
            before: 'A small ring sitting on a gray counter, shot from a distance.',
            after: 'The result: the ring doubled into two stacked bands with an oversized green stone.' },
          { base: '/assets/media/pavilion/ba/miss-bracelet',
            before: 'A sapphire tennis bracelet laid in a circle on white cloth.',
            after: 'The result: the bracelet broken into two pieces with a fragment floating above it.' }
        ]
      }, plates: {
        cols: 2,
        ratio: '1/1',
        items: [
          { src: '/assets/media/pavilion/plates/miss_0_1.webp', alt: 'A gold flower bangle with emeralds whose right-hand end dissolves into repeated, unreadable detail.' },
          { src: '/assets/media/pavilion/plates/miss_0_2.webp', alt: 'A diamond eternity band on a gray cushion, the cushion mangled and a fingernail still visible at the bottom of the frame.' }
        ]
      } },
      { h: 'My part', p: [
        'I built the product end to end, from the idea to the thing jewelers open every morning: the ComfyUI backend and the node chain behind each mode, the model settings, the front end, the API wiring, and a database behind an admin page that shows every operation as it runs.',
        'The art direction is not a separate job from that one. Deciding what a correct result looks like — which millimeter matters, which does not — is most of the design work here.',
        'What I could not decide alone was the shape of the day. That was calibrated with Pavilion throughout: they know better than I do what a jeweler needs from this tool this month. Nobody else has worked on it, and I still maintain it.'
      ] }
    ],
  },
  {
    slug: 'jurassic-world',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: '3D artist, animator',
    title: 'Jurassic World: Rebirth',
    tagline: 'A Snapchat lens that ran on a cinema lobby screen, not a phone.',
    /* The role here is 3D artist and animator, and it stays that. What the
       page opens with is the engineering the role does not say out loud. */
    lead: 'A lobby-screen lens with the whole scene inside a 60,000-polygon budget. Retopology ran two ways \u2014 by hand where the silhouette mattered, AI where it did not \u2014 and cut development time by about 45 percent.',
    client: 'Universal Pictures, with Pretty Big Monster',
    role: '3D artist, animator',
    year: '2025',
    disciplines: '3D, cloth simulation, rigging, animation',
    made: 'hand',
    tools: ['Marvelous Designer', 'Blender', 'Substance 3D Painter', 'Snapchat AR'],
    note: 'A whole scene inside a 60,000-polygon budget.',
    links: [
      ['Elsewhere', 'The lens on Pretty Big Monster’s Instagram', 'https://www.instagram.com/reels/DLnEWzWJzJK/']
    ],
    share: '/assets/media/jurassic-world/og-cover.jpg',
    thumb: { poster: '/assets/media/jurassic-world/thumb.webp', video: '/assets/media/jurassic-world/thumb.mp4' },
    hero: {
      video: '/assets/media/jurassic-world/hero.mp4',
      poster: '/assets/media/jurassic-world/poster.webp',
      ratio: '16/9',
      autoplay: false,
      caption: 'The breakdown reel, 36 seconds: the lens first, then the suit, the rig and the helmet.'
    },
    sections: [
      { h: 'Overview', p: [
        'Part of the global marketing campaign for Jurassic World: Rebirth (2025). I worked on it as a freelance 3D artist with Pretty Big Monster, for Universal Pictures.',
        'It is one Snapchat lens, and it did not run on phones. It ran on booths standing in cinema and mall lobbies: a 55-inch display in a styled frame, with a camera feeding its picture through the lens. You walk past, you are in the shot, and the scene plays around you.',
        'The scene is from the film. A worker in a protective lab suit, and the D-Rex that comes for him.'
      ] },
      { h: 'About the reel', p: [
        'The first ten seconds are the lens running: a poster on a wall, and something behind it that does not stay there. The rest is the breakdown, the suit, the rig and the helmet.'
      ] },
      { h: 'My part', p: [
        'The protective suit was built in Marvelous Designer: pattern pieces stitched and simulated, so the fabric folds the way cloth actually folds rather than the way a modeler guesses it does. The helmet I modeled in Blender and rebuilt to run inside the AR engine, keeping the same silhouette and the same read at a polygon count a lens can carry at frame rate. Both were textured in Substance Painter.',
        'I also modeled the D-Rex claw, rigged it, and rigged the character. The blue-to-red in the reel is weight paint.'
      ] },
      { h: 'The budget everything had to fit', p: [
        'The whole experience is one scene, and the scene had a ceiling of 60,000 polygons. A budget that tight is won or lost in retopology, so I ran it two ways: by hand where the silhouette mattered, and with AI retopology where it did not. Between them that cut development time by around 45 percent.'
      ] }
    ],
    credits: [
      ['3D & animation', 'Artem Maslov'],
      ['Agency', 'Pretty Big Monster'],
      ['Studio', 'Universal Pictures']
    ]
  },
  {
    slug: 'smurfs',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: '3D artist, animator',
    title: 'Smurfs',
    tagline: 'Seven outfits, thirteen accessories, one skeleton, no gaps.',
    lead: 'Seven outfits and thirteen accessories on one skeleton and one animation: swap any of them while it plays and nothing breaks. The lens is still live.',
    client: 'Paramount Animation, with Pretty Big Monster',
    role: '3D artist, animator',
    year: '2025',
    disciplines: '3D, texturing, rigging, animation',
    made: 'hand',
    tools: ['Blender', 'Substance 3D Painter', 'Lens Studio'],
    note: 'Everything swappable, all on one skeleton and one animation.',
    links: [
      ['Lens', 'Smurf Yourself on Snapchat', 'https://www.snapchat.com/lens/452b4cf8e281476b9449bdcc6dd97807']
    ],
    share: '/assets/media/smurfs/og-cover.jpg',
    thumb: { poster: '/assets/media/smurfs/thumb.webp' },
    hero: {
      video: '/assets/media/smurfs/hero.mp4',
      poster: '/assets/media/smurfs/poster.webp',
      ratio: '16/9',
      caption: 'Turntables on a gray backdrop: Brainy and his boba, Smurfette and her camera, Papa Smurf.'
    },
    sections: [
      { h: 'Overview', p: [
        'A Snapchat AR experience and a browser game for the global marketing campaign of Smurfs (2025), made for Paramount Animation with Pretty Big Monster. The lens is Smurf Yourself and it is still live.',
        'I was the 3D artist: the characters, their wardrobe, the world they stand in, and the rigs and animation underneath all of it.'
      ] },
      { h: 'The characters', p: [
        'Each one turns on a plain gray backdrop, where a model has nowhere to hide. The accessories are what give each character away: Brainy carries a boba with the pearls settled in the bottom of the cup, Smurfette has a camera hanging at her hip.',
        'Seven outfits and thirteen accessories, all textured by hand.'
      ] },
      { h: 'One skeleton', p: [
        'Everything a player can change — outfit, accessory, headwear, facial expression, body part — is bound to a single skeleton and driven by a single animation. Swap any of it while the animation is playing and nothing is allowed to break: no gap where a sleeve meets a wrist, no mesh pushing through another, no part that stops reading as a Smurf.',
        'That one constraint decides how every piece gets built. A garment cannot be modeled to fit one body and corrected later, it has to fit every combination it can land in, hold the house style, stay inside the engine budget, and still look presentable in close-up. Most of the work on this project is in that sentence.'
      ] },
      { h: 'Building a world that already exists', p: [
        'Nothing in the environment existed to copy. A conveyor belt, stands, gears, plants, flowers — all built from scratch, and all of it had to look as though it had always been in the Smurfs’ world rather than borrowed into it.',
        'That is an art direction problem before it is a modeling one: you decide what the rules of the world are, then obey them. Then every object gets optimized for the engine all over again.'
      ] }
    ],
    clips: {
      h: 'The world',
      cols: 1,
      ratio: '1920/880',
      fit: 'cover',
      lead: 'The environment the characters stand in. A wipe runs across it halfway through and leaves the wireframe behind, so you can see what the mushrooms and the bridge are actually made of.',
      items: [
        { src: '/assets/media/smurfs/clips/world.mp4', alt: 'A plank bridge over a lily pond, mushrooms and ferns on the bank, a wipe crossing the shot to reveal the wireframe underneath.' }
      ]
    },
    credits: [
      ['3D & animation', 'Artem Maslov'],
      ['Agency', 'Pretty Big Monster'],
      ['Studio', 'Paramount Animation']
    ]
  },
  {
    slug: 'mdlbeast',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: 'Art Director',
    title: 'MDLBEAST',
    tagline: 'A festival built out of sand particles, rebuilt to run on a phone.',
    client: 'MDLBEAST, Tactical with Snapchat',
    role: 'Art director, visual developer',
    year: '2023',
    disciplines: 'AR direction, VFX, 3D, storyboarding',
    made: 'hand',
    tools: ['Blender', 'After Effects', 'Lens Studio'],
    note: 'Particle work from a desert festival, made to survive inside a Snapchat lens.',
    links: [
      ['Lens', 'Friend Finder on Snapchat', 'https://www.snapchat.com/lens/6fa012b492d24978bf7a55c96b2b9915'],
      ['Lens', 'The screen activation on Snapchat', 'https://www.snapchat.com/lens/7fce32322c234153a7406b72b5fe05b8'],
      ['Press', 'Saudi Gazette', 'https://saudigazette.com.sa/article/638735/BUSINESS/MDLBEAST-Snapchat-announce-partnership-to-bring-cutting-edge-AR-tech-to-Soundstorm-festival']
    ],
    share: '/assets/media/mdlbeast/og-cover.jpg',
    thumb: { poster: '/assets/media/mdlbeast/thumb.webp', video: '/assets/media/mdlbeast/thumb.mp4' },
    hero: {
      video: '/assets/media/mdlbeast/hero.mp4',
      poster: '/assets/media/mdlbeast/poster.webp',
      ratio: '16/9',
      caption: 'Tactical’s case film for the festival. The AR starts around 0:22, when the phones come out.'
    },
    sections: [
      { h: 'The festival', p: [
        'Soundstorm is MDLBEAST’s festival in the desert outside Riyadh, and it is the largest electronic music event in the Middle East: eight stages, around 200 artists, and more than 600,000 people across three days by the festival’s own count.'
      ] },
      { h: 'The project', p: [
        'A collaboration between Snapchat Saudi Arabia and MDLBEAST, with Tactical as the agency executing the AR. Two experiences came out of it.',
        'Friend Finder is a compass built into a Snapchat lens. You hold the phone up and it points at the person you are trying to reach, on a site the size of a small town, in the dark, with a festival crowd around you.',
        'The second was an activation at the entrance: a large screen ringed with LED panels, built up into a booth that everyone arriving walked past. You could step into it and record yourself.'
      ] },
      { h: 'The hard part', p: [
        'The festival’s visual language is particles. It happens in the desert, so the particles are sand, and the idea that sound frequencies push sand into patterns runs through everything the festival puts out.',
        'That language had to survive inside a Snapchat lens, which is not where particle simulation lives comfortably. How much simulation a lens can carry, and what has to be faked once it cannot, was the technical problem across the whole AR side.'
      ] },
      { h: 'About the film', p: [
        'The film above is Tactical’s case film for the festival as a whole, not for my part of it. The first twenty seconds are the event itself: the grounds from the air, the stages, the crowd. The AR starts around 0:22 and runs to the end.'
      ] },
      { h: 'My part', p: [
        'I directed the AR activation, and worked hands-on on parts of Friend Finder: the VFX particles, 3D modeling and storyboarding. The brief was to make one experience out of two visual languages: the festival’s and Snapchat’s.',
        'I reported directly to the creative director at Snapchat. The face in the Friend Finder preview is mine.'
      ] }
    ],
    credits: [
      ['AR direction', 'Artem Maslov'],
      ['Agency', 'Tactical'],
      ['Partner', 'Snapchat'],
      ['Creative development', 'Ibrahim Boona', 'https://www.linkedin.com/in/ibrahim-boona-68618530/']
    ]
  },
  {
    slug: 'visit-dubai',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: 'Art Director',
    title: 'Visit Dubai',
    tagline: 'Interactive installations that sell a city on a crowded expo floor.',
    client: 'Visit Dubai, with Tactical',
    role: 'Art director, visual developer',
    year: '2023',
    disciplines: 'Art direction, installation, key visuals',
    made: 'hand',
    tools: ['Blender', 'Unity', 'Apple Vision Pro'],
    note: 'Shown at Web Summit, VivaTech and London Tech Week.',
    links: [],
    share: '/assets/media/visit-dubai/og-cover.jpg',
    thumb: { poster: '/assets/media/visit-dubai/thumb.webp', video: '/assets/media/visit-dubai/thumb.mp4' },
    hero: {
      video: '/assets/media/visit-dubai/hero.mp4',
      poster: '/assets/media/visit-dubai/poster.webp',
      ratio: '16/9',
      caption: 'The city as the installation shows it: a boulevard you fly down, with the screens hung in the air above it.'
    },
    order: ['plates', 'clips', 'films'],
    summary: [
      ['Made', 'Interactive installations for Visit Dubai at Web Summit, VivaTech and London Tech Week.'],
      ['Needed', 'Visit Dubai presents the city to investors, businesses and future residents. At tech conferences it needed something that stops people and explains Dubai life at a glance.'],
      ['Worth', 'An investor on any continent could put on a headset and spend a minute inside Dubai: what the city has already built, and what it intends to become.']
    ],
    sections: [
      { h: 'The problem', p: ['Visit Dubai is part information hub, part city marketing office. On a busy conference floor it competes with hundreds of booths for a few seconds of attention, and has to explain both business opportunity and everyday life.'] },
      { h: 'What I built', p: [
        'Five experiences, two of them the focus of the whole project. The one on this page is the Apple Vision Pro experience.',
        'Put the headset on and you are in Dubai for a minute: the history and the culture of the region, the success stories already standing, the brands, and the city this one intends to become. A city grown in the middle of a desert, making the case for itself.'
      ] },
      { h: 'Finding the visual language', p: [
        'The first problem arrived before anything was built. The visual language had to carry the spirit of Dubai for a marketing audience and stay inside the schedule and the technical limits at the same time. A concept nobody can build on time is not a concept; it is a drawing.'
      ] },
      { h: 'Why it is a 360 render and not realtime', p: [
        'The technical constraints were the ones nobody on the team knew the full shape of. The Apple Vision Pro was still an experimental device: how to light a scene for it, how to prepare a model, how to render it — all of it was an open question.',
        'So the limits were researched while the visual language was still being decided, and the team chose to deliver the final Vision Pro experience as a 360 video render rather than realtime. Driven through Unity, the realtime renderer was too limited in 2023 and 2024. Bloom is the clean example: in those years you could not have it on the device. And Dubai without the glow — the neon signs, the lit streets, the lit towers — is not Dubai.',
        'Giving up realtime bought back the picture the city actually needed.'
      ] },
      { h: 'Onto the floor', p: [
        'The job did not end at the render. At the events, somebody who had never worn a Vision Pro had to put one on at a busy stand and know what to do within seconds — so finding the way to tell them was part of the work.'
      ] },
      { h: 'My part', p: [
        'Art direction and visual development, from the first prototypes, where the UX and the visual language were both still open, through to the events themselves. I worked hands-on on the 2D and 3D key visuals.'
      ] }
    ],
    plates: {
      h: 'The design system that did not ship',
      prefix: 'dubai',
      lead: 'Shaders and a design system for the first version: what a building is, what a road is, where a banner can sit. The client went another way on the visuals in the end, so the scene that shipped was built without any of it. Open any sheet full size.',
      cols: 3,
      ratio: '16/9',
      items: [
        { n: 1, alt: 'Banner sheet: screen and sign formats laid out in isometric on dark navy.' },
        { n: 2, alt: 'Building sheet: landmarks, secondary buildings and first-line buildings, named and ranked.' },
        { n: 3, alt: 'Five building types lined up, from wireframe to shaded.' },
        { n: 4, alt: 'Two tower variants side by side, one in wireframe and one shaded.' },
        { n: 5, alt: 'A tower in wireframe next to the same tower with its material on.' },
        { n: 6, alt: 'Road sheet: highway, subway and railway as three strips.' }
      ]
    },
    clips: {
      h: 'The shaders moving',
      lead: 'The same system in motion. Short, silent, on a loop.',
      ratio: '16/9',
      items: [
        { src: '/assets/media/visit-dubai/clips/dubai_shader_1.mp4', alt: 'Light running down a tower facade as data.' },
        { src: '/assets/media/visit-dubai/clips/dubai_shader_2.mp4', alt: 'A tower drawing itself in blue wireframe.' },
        { src: '/assets/media/visit-dubai/clips/dubai_shader_3.mp4', alt: 'Streaks of traffic light pulling along a road.' }
      ]
    },
    films: [
      {
        h: 'First tests',
        src: '/assets/media/visit-dubai/films/first-tests.mp4',
        poster: '/assets/media/visit-dubai/films/first-tests.webp',
        ratio: '1080/608',
        lead: 'Render tests on that first system: the elements in place, the animation, how fast the camera travels, what the whole thing feels like to sit through.',
        caption: 'Thirteen seconds of the first direction, before it was dropped.'
      },
      {
        h: 'The experience',
        src: '/assets/media/visit-dubai/films/vision-pro.mp4',
        poster: '/assets/media/visit-dubai/films/vision-pro.webp',
        ratio: '16/9',
        lead: 'The whole thing as it runs, recorded through an Apple Vision Pro.',
        caption: 'A minute in the headset, end to end.'
      }
    ],
    credits: [
      ['Art direction & visual development', 'Artem Maslov'],
      ['Agency', 'Tactical'],
      ['Innovation lead', 'Gaynelle Brautigam', 'https://www.linkedin.com/in/gaynelle-szoboszlai/'],
      ['Strategy', 'Camilla Burchill', 'https://www.linkedin.com/in/camillaburchill/'],
      ['Project director', 'Leen Verburgh', 'https://www.linkedin.com/in/leenverburgh/'],
      ['Lead producer', 'Eillie Wornell', 'https://www.linkedin.com/in/eillie-wornell-2479b11b/'],
      ['Unity development', 'Khalil Hasnaoui', 'https://www.linkedin.com/in/khalil-hasnaoui-aa704410b/'],
      ['Unity development', 'Robert Mooijman', 'https://www.linkedin.com/in/robert-mooijman-23788920/'],
      ['3D design', 'Seki Bacsain', 'https://www.linkedin.com/in/sekibacsain/']
    ]
  },
  {
    slug: 'nike',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: 'Art Director (R&D)',
    title: 'Nike — AI R&D',
    tagline: 'Speculative brand motion, with the movement blocked in 3D rather than guessed by a model.',
    type: 'Speculative R&D',
    role: 'Art director, AI artist',
    year: '2025',
    disciplines: 'Art direction, AI video, 3D',
    made: 'hand machine',
    tools: ['Blender', 'ComfyUI', 'Wan 2.0', 'Adobe Firefly', 'Nano Banana', 'Flux'],
    note: 'Sketch to motion test in a day, without the art direction drifting off brand.',
    share: '/assets/media/nike/og-cover.jpg',
    thumb: { poster: '/assets/media/nike/thumb.webp', video: '/assets/media/nike/thumb.mp4' },
    hero: {
      video: '/assets/media/nike/hero.mp4',
      poster: '/assets/media/nike/poster.webp',
      ratio: '16/9',
      caption: 'The reel. Soft body simulation in Blender, rendered as a depth map, driven through Wan 2.0.'
    },
    summary: [
      ['Made', 'Speculative visuals and motion concepts built around Nike as the subject — self-initiated R&D, not commissioned work.'],
      ['Needed', 'A look at how generative AI could speed up ideation and give future campaigns repeatable creative pipelines.'],
      ['Worth', 'A tested mix of node-based AI, 3D and prompt engineering, plus a body of concept visuals to pitch the approach with.']
    ],
    sections: [
      { h: 'The problem', p: ['Brand storytelling still runs on long production cycles. The research asked how AI could accelerate ideation while keeping the art direction recognizably Nike.'] },
      { h: 'What I built', p: ['A pipeline that combined node-based generation in ComfyUI, Adobe Firefly and 3D in Blender, so concepts could move from sketch to motion test quickly.'] },
      { h: 'How it was made', p: [
        'The motion is a soft body simulation in Blender, blocked out so the movement stays mine rather than something a model guesses at.',
        'The depth map comes out of Blender itself — z-depth and mist off the render layers, not depth a preprocessor guessed back out of a finished frame. It carries geometry and animation and no look at all, which is exactly what Wan 2.0 wants as a reference to follow. ComfyUI is the graph that drives it there.',
        'The look arrives separately, as a style frame transferred on top. One thing has to line up: the first frame of the depth map and the style frame have to be the same shot. When those two drift apart, the model starts inventing.'
      ] },
      { h: 'My part', p: ['I led the research: the concept, the creative direction, the Blender simulation and its depth passes, and the style frames the look was transferred from.'] }
    ],
    clips: {
      h: '3D exploration',
      lead: 'Raw passes, straight out of Blender. The middle one is the file itself.',
      ratio: '16/9',
      items: [
        { src: '/assets/media/nike/clips/nike_3d_1.mp4', alt: 'Soft bodies drifting around a glowing swoosh on black.' },
        { src: '/assets/media/nike/clips/nike_3d_2.mp4', alt: 'The Blender viewport, spheres colliding around the swoosh while the simulation runs.' },
        { src: '/assets/media/nike/clips/nike_3d_3.mp4', alt: 'The same shot as a depth pass: white shapes on flat gray, no light and no color.' }
      ]
    },
    plates: {
      h: 'Style references',
      lead: 'Stills made in Firefly, Nano Banana and Flux to find a look before any of it moved. Open any one full size.',
      cols: 3,
      ratio: '16/9',
      items: [
        { n: 1, alt: 'Neon swoosh over pale spheres and foam.' },
        { n: 2, alt: 'Swoosh among blue glass bubbles.' },
        { n: 3, alt: 'Swoosh glowing through pink cloud.' },
        { n: 4, alt: 'Swoosh among orange and purple balloons.' },
        { n: 5, alt: 'Swoosh among bright spheres on lilac.' },
        { n: 6, alt: 'Swoosh behind large glossy spheres.' }
      ]
    },
    credits: [['Art direction & AI', 'Artem Maslov']]
  },
  {
    slug: 'lexus',
    /* One line, for the card in a grid. The full role is in the case meta. */
    cardRole: 'Art Director (R&D)',
    title: 'Lexus — AI R&D',
    tagline: 'Speculative brand visuals and motion, built in node-based AI pipelines.',
    type: 'Speculative R&D',
    role: 'Art director, AI artist',
    year: '2025',
    disciplines: 'Art direction, AI video, 3D',
    made: 'hand machine',
    tools: ['Blender', 'ComfyUI', 'Seedance 1.5', 'Weavy', 'Kling', 'Veo', 'Runway', 'Nano Banana Pro'],
    note: 'One pipeline carried a look from stills into motion, with the car kept accurate in 3D.',
    share: '/assets/media/lexus/og-cover.jpg',
    thumb: { poster: '/assets/media/lexus/thumb.webp', video: '/assets/media/lexus/thumb.mp4' },
    hero: {
      video: '/assets/media/lexus/hero.mp4',
      poster: '/assets/media/lexus/poster.webp',
      ratio: '16/9',
      caption: 'The film. Speed and camera blocked in Blender, every finished frame rendered with Seedance 1.5.'
    },
    summary: [
      ['Made', 'A set of speculative visuals and motion concepts for Lexus, made as self-initiated R&D.'],
      ['Needed', 'An answer to whether AI could change brand storytelling: faster ideation and new pipelines, without diluting a premium brand.'],
      ['Worth', 'Tested workflows, and a body of concept visuals: where a future Lexus campaign could go, and how fast it could get there.']
    ],
    sections: [
      { h: 'The problem', p: ['Generative tools move faster than the pipelines a brand already has. The question was whether art direction and automation could work together to sharpen a luxury brand’s identity rather than flatten it into generic AI imagery.'] },
      { h: 'What I built', p: ['Node-based workflows in Weavy tied image generation, video models and 3D together into one repeatable pipeline. Stills set the look, video models carried it into motion, and Blender kept form and product accurate.'] },
      { h: 'How it was made', p: [
        'The motion starts in Blender. I block the car and the camera there — plain geometry, no look — only to fix the speed and the camera move.',
        'That blocking pass is the reference. Everything finished was rendered in ComfyUI, with Seedance 1.5 carrying the frames.'
      ] },
      { h: 'My part', p: ['I led the research: the concept, the creative direction, the Blender blocking, and the Weavy and ComfyUI graphs behind every finished frame.'] }
    ],
    clips: {
      h: '3D and motion tests',
      lead: 'The blocking pass, then two renders made from it. Short, silent, on a loop.',
      ratio: '16/9',
      items: [
        { src: '/assets/media/lexus/clips/lexus_3d_1.mp4', alt: 'Untextured gray car turning on a plain studio floor: the Blender blocking pass.' },
        { src: '/assets/media/lexus/clips/lexus_3d_2.mp4', alt: 'The car driving a wet night road, headlights on.' },
        { src: '/assets/media/lexus/clips/lexus_3d_3.mp4', alt: 'The car throwing dust across desert sand at sunset.' }
      ]
    },
    plates: {
      h: 'Stills',
      lead: 'Where the car could sit, and what light it holds. Open any one full size.',
      cols: 4,
      ratio: '16/9',
      items: [
        { n: 1, alt: 'The car head-on in a dark studio, headlights lit.' },
        { n: 2, alt: 'The car on a dune ridge at dusk.' },
        { n: 3, alt: 'Front view on a white salt flat under a pale sky.' },
        { n: 4, alt: 'Three-quarter view on desert sand at sunset.' },
        { n: 5, alt: 'Side view on a cracked salt flat under a pink sky.' },
        { n: 6, alt: 'The car in Dubai traffic, towers behind it.' },
        { n: 7, alt: 'The car in front of a glass tower at golden hour.' },
        { n: 8, alt: 'Rear three-quarter on a salt flat at sunset.' }
      ]
    },
    credits: [['Art direction & AI', 'Artem Maslov']]
  }
];

export const experiments = [
  {
    slug: 'web-configurator',
    title: 'Web configurator',
    desc: 'Put a 3D object into a photograph of a real room',
    state: 'Demo',
    year: '2026',
    share: '/assets/media/configurator/og-cover.jpg',
    thumb: { poster: '/assets/media/configurator/thumb.webp', video: '/assets/media/configurator/thumb.mp4' },
    hero: {
      video: '/assets/media/configurator/hero.mp4',
      poster: '/assets/media/configurator/poster.webp',
      ratio: '1812/1020',
      caption: 'The tool, end to end: background in, floor marked, model placed, render out.'
    },
    stack: [
      ['Scene', 'glTF, loaded as .glb'],
      ['Ground plane', 'Homography from four marked points'],
      ['Render', 'ComfyUI, basic workflows for now'],
      ['Test build', 'Vercel'],
      ['Front end', 'Next.js and React, three.js in the viewport, Tailwind for the interface']
    ],
    sections: [
      {
        h: 'What it does',
        p: [
          'A browser tool for putting a 3D object into a photograph of a real room. You drop in a background, mark where the floor is, add a .glb, and it renders the object into the scene at the right scale, in the right perspective, under the right light.',
          'The point is to skip the shoot. If a product exists as a model, it can stand in a hundred rooms by tonight.'
        ]
      },
      {
        h: 'How it knows where the floor is',
        p: [
          'A photograph has no depth, so the tool has to be told where the ground is. You mark four points on the floor in the image, and they are matched to the corners of a flat rectangle. That pair gives a homography: a 3×3 matrix that maps any point on that plane in the photograph to a point on the plane in space, and back again.',
          'Once it has that matrix the tool knows where the ground runs, how it recedes, and how large a meter is at any depth in the frame. The model then stands on the plane instead of floating in front of the picture.'
        ],
        figure: {
          src: '/assets/media/configurator/set-floor.mp4',
          ratio: '16/9',
          caption: 'Marking the floor. Until it is set, the background is flagged “needs floor”.'
        }
      },
      {
        h: 'Where the render happens',
        p: [
          'Placement happens in the browser. The render happens on a ComfyUI backend. Those are basic workflows for now: enough to ground the object, match the light in the room and put a shadow where it touches the floor.'
        ]
      }
    ],
    compare: {
      h: 'Before and after',
      lead: 'Left is what the viewport gives you: the model lit flatly, floating, bounding box still showing. Right is what comes back from the render.',
      pairs: [
        { before: '/assets/media/configurator/before-01.webp', after: '/assets/media/configurator/after-01.webp',
          caption: 'Office corridor. Two models, one render.' },
        { before: '/assets/media/configurator/before-02.webp', after: '/assets/media/configurator/after-02.webp',
          caption: 'Same room, three models.' },
        { before: '/assets/media/configurator/before-03.webp', after: '/assets/media/configurator/after-03.webp',
          caption: 'Different background, same placement pass.' }
      ],
      ratio: '1375/768'
    },
    tryIt: {
      href: 'https://product-composite.vercel.app/?preset=background_02',
      label: 'Open the test build',
      note: 'A working build with a preset background. Rough edges included.'
    },
    roadmap: {
      h: 'Next',
      items: [
        ['Automatic perspective detection', 'Find the ground plane from the photograph, so nobody has to mark it.'],
        ['Multi-surface detection', 'Tables, shelves and other planes, not just the floor.'],
        ['Object masking', 'Let a model sit behind something that is already in the photograph.']
      ]
    }
  },
  {
    slug: 'raft',
    title: 'Raft',
    desc: 'A co-op VR world, built in a week for the Meta Horizon competition',
    state: 'Winner',
    year: '2025',
    share: '/assets/media/raft/og-cover.jpg',
    thumb: { poster: '/assets/media/raft/thumb.webp' },
    hero: {
      video: '/assets/media/raft/films/reel.mp4',
      poster: '/assets/media/raft/films/reel.webp',
      ratio: '1720/968',
      caption: 'Forty-nine seconds in the world: the lobby island, a run down the river, the leaderboards strung between two palms, and the fire everyone ends up back at.'
    },
    stack: [
      ['Engine', 'Meta Horizon Worlds'],
      ['3D', 'Blender'],
      ['2D and key art', 'Adobe Suite'],
      ['Code', 'Claude Code'],
      ['Voice and sound', 'ElevenLabs'],
      ['Music', 'GarageBand'],
      ['Generative', 'Meta Gen AI']
    ],
    sections: [
      { h: 'The brief', p: [
        'Meta Horizon Creator Competition: Mobile Innovation. Build a world for Horizon, on the phone as much as the headset. We had one week.',
        'Pavlo Tkachenko already had a raft physics prototype running and I had nine years of production behind me. We agreed on the split in the first conversation and never renegotiated it: he took logic and physics, I took the art and the 3D. Neither of us touched the other half.'
      ] },
      { h: 'What it is', p: [
        'Raft: Survive Together. Up to eight people stand on one raft going down a procedurally generated river, and the river is never the same twice. Rocks come at you. The raft bobs and tilts under the weight of whoever is standing where.',
        'Between runs everyone ends up on a small island with a fire on it, two leaderboards nailed between the palms — one for seconds survived, one for stars collected — and enough to do that the wait does not feel like one.'
      ] },
      { h: 'The part that won it', p: [
        'The prize was for Best New User Onboarding Experience, and that was the design, not a side effect of it.',
        'There is no tutorial in Raft. There are no buttons to learn, because there is no control scheme: the raft turns because the people on it walked to one side. You work that out in about four seconds, by walking, and then you know it in your body rather than from a panel of text.',
        'Nothing tells you where to go either. The spawn point is lit one way and the dock is lit another, the sound comes from where you are meant to end up, and the island is small enough that going the wrong way takes you past the fire. That is the whole onboarding: a world shaped so that the obvious thing to do is the right one.',
        'It is also the part I would argue hardest for. Every instruction you write is a confession that the space did not explain itself.'
      ] },
      { h: 'My part', p: [
        'The art direction and all of the 3D: the island, the raft, the river, the props, the key art, and the pass over everything that makes a one-week build look like a thing somebody made on purpose.',
        'The fire in the lobby is the piece I would point at. It is not a feature. It is a warm thing in the middle of a small island, and people walk toward it and stand around it and start talking, which is the only reason the lobby works at all.'
      ] }
    ],
    tryIt: {
      href: 'https://horizon.meta.com/world/1584989406013221/?locale=en_GB',
      label: 'Open Raft in Horizon',
      note: 'Live, free, and better with other people in it.'
    },
    credits: [
      ['Logic and physics', 'Pavlo Tkachenko', 'https://www.linkedin.com/in/pavlo-tkachenko-b7826126a/'],
      ['Art direction and 3D', 'Artem Maslov'],
      ['Submission', 'Raft on Devpost', 'https://devpost.com/software/raft-0mbuas'],
      ['Written up by', 'Devpost: how a former ship navigator and a Snapchat veteran built a VR world in one week', 'https://info.devpost.com/blog/user-story-pavlo-artem']
    ]
  },
  {
    slug: 'csgo',
    title: 'Cat Therapy',
    desc: 'A Counter-Strike weapon skin, painted on canvas first',
    state: 'Entered',
    year: '2019',
    share: '/assets/media/csgo/og-cover.jpg',
    thumb: { poster: '/assets/media/csgo/thumb.webp', video: '/assets/media/csgo/thumb.mp4' },
    hero: {
      video: '/assets/media/csgo/hero.mp4',
      poster: '/assets/media/csgo/poster.webp',
      ratio: '16/9',
      caption: 'The promo film, a minute long: a tag on a wall, the canvas it was really painted on, and the weapon it ends up as.'
    },
    sections: [
      { h: 'The question', p: [
        'Counter-Strike turned twenty in 2019 and ran a contest for it. A skin is a flat texture wrapped around a weapon, and almost everyone draws one. I wanted to know what happens if the artwork is made the way a wall gets made — spray, stencils, a surface you can get paint on — and only then becomes a texture.'
      ] },
      { h: 'What I built', p: [
        'Cat Therapy: one pattern, painted for real and then cut across five weapons.',
        'Black ground rolled onto a square canvas. White lines thrown across it. Circles cut out of card, taped down, sprayed through. The sheet ends up a grid of flat faces — some grinning, some drooling, all of them cats — and that sheet is the texture.'
      ] },
      { h: 'What came out', p: [
        'The pattern carries across five weapons: a sniper rifle, a bolt-action, an assault rifle with a scope, an AK and a machine pistol. It is one artwork cut five ways, and it reads at a glance on every one of them, which is the whole job of a skin.',
        'The film is the other half of the answer. It opens on a wall in an alley, a blue cat face blooms out of the brick, and then it goes indoors and shows the pattern actually being painted. A skin made by hand is worth saying out loud.'
      ] },
      { h: 'Tools', p: ['Spray paint, cut card and a canvas on the floor.'] }
    ],
    plates: {
      h: 'Process',
      lead: 'The boards I kept from it: the finished weapons, and the room the pattern was made in. Open any one full size.',
      cols: 3,
      ratio: '16/9',
      items: [
        { n: 1, alt: 'The skin on five weapons, laid out over a blue field of cat faces.' },
        { n: 2, alt: 'Spray going down over a cut stencil taped to the big canvas, cans standing on the floor beside it.' },
        { n: 3, alt: 'Four canvases in progress: white scribbles on black, orange test blobs, circles cut out, and the finished grid of faces.' },
        { n: 4, alt: 'Polaroids from the shoot: the canvas on a stand in a white room, taped up on the floor, and carried out into a street.' },
        { n: 5, alt: 'A spray can and a cut stencil lying on the painted sheet, circles sprayed through it.' }
      ]
    }
  }
];

export const clients = ['Dior', 'Amazon', 'L’Oréal', 'Cartier', 'Snap Inc.',
  'Universal Pictures', 'Paramount Animation', 'Olympic Games'];

/* Resources is built and reachable at /resources/, but stays out of the nav
   until there is something on the shelf. Add the row back to show it again. */
export const nav = [
  ['Work', '/work/'],
  ['Lab', '/lab/'],
  ['About', '/about/']
];

export const lab = {
  intro: 'Things I build for myself, usually to answer a question. Each one is written up the same way: what I set out to do, what I built, what came out.',
  playground: {
    /* Off until Face Pong is a thing someone can actually play. The section is
       written and kept; set this to true and it is back on the page. */
    show: false,
    body: 'Small things that exist only to be played with.',
    next: 'First on the bench: Face Pong. The paddles are photographs of my face, and the expression changes on every hit.'
  }
};

export const resourceTypes = ['All', 'Files', 'Tutorials', 'Tips', 'Articles'];

export const resources = [
  { type: 'Files', title: '[TODO: workflow name]', desc: '[TODO: one line on what it does]', format: '[TODO: format]', size: '[TODO: size]', action: 'Download' },
  { type: 'Files', title: '[TODO: workflow name]', desc: '[TODO: one line on what it does]', format: '[TODO: format]', size: '[TODO: size]', action: 'Download' },
  { type: 'Tutorials', title: '[TODO: tutorial name]', desc: '[TODO: what you will be able to do after it]', format: '[TODO: video, length]', size: '', action: 'Watch' },
  { type: 'Tutorials', title: '[TODO: tutorial name]', desc: '[TODO: what you will be able to do after it]', format: '[TODO: video, length]', size: '', action: 'Watch' },
  { type: 'Tips', title: '[TODO: tip]', desc: '[TODO: the one thing it saves you from]', format: '[TODO: read time]', size: '', action: 'Read' },
  { type: 'Articles', title: '[TODO: article title]', desc: '[TODO: the argument in one line]', format: '[TODO: read time]', size: '', action: 'Read' }
];

export const about = {
  /* A page title, like Work and Lab. The statement it used to repeat lives on
     the home page, where it is the site's one claim. Put a sentence back here
     and it renders as the page's standfirst. */
  h1: 'About',
  /* Paragraph one is the positioning, the same claim the home page opens with,
     said at length and with the constraints named. The history follows it. */
  bio: [
    'I am Artem Maslov, an art director and creative technologist in Edmonton. I art-direct images and build the systems that make them, and most of the work happens where the technology pushes back: a phone lens that cannot run particles, a 60,000-polygon budget, a headset that cannot do bloom, a jeweler’s phone photograph that has to come out as a catalog frame. Holding the look under a constraint like that is the art direction; making it repeatable is the engineering. They are two halves of one job, not two titles.',
    'For nine years I made images for brands, studios and platforms: senior concept artist at Snap, associate art director at Tactical, and my own studio, ARNI. Since 2024 I write the other half: code, node graphs and generative pipelines, approached the way a lab approaches a problem — a question, a test, a measurement. Both halves are on this site, because the second is what keeps the first current.',
    'Both halves run on the same habit: take something, put it where it does not belong, and keep a straight face long enough to see what happens. Sometimes that is a bar stool carried into a forest. More often it is a tool used for a job it was not built for, which is where most of the work on this site started.'
  ],
  /* Two states of one person. The first frame is the hand: a stool carried into a
     ravine, held with a straight face. The second is the machine, and it only ever
     appears on hover, so it carries no alt text and the page reads complete without
     it. `note` runs after the place in the caption. */
  portrait: {
    src: '/assets/media/portrait/portrait.webp',
    alt: 'Artem Maslov, head and shoulders, before a pale wall crossed by a single horizontal strip of light.',
    w: 900, h: 1125
  },
  spec: [
    ['Role', ['Creative Technologist & Art Director']],
    ['Practice', ['AI video, 3D, AR, generative pipelines']],
    ['Previously', ['Senior concept artist, Snap', 'Associate art director, Tactical', 'Founder, ARNI']],
    ['Teaching', ['Casual instructor, NAIT, from 2026', 'GDEV 1015, Visual Assets for Games']],
    ['Education', ['BFA, Odesa State Academy of Civil Engineering and Architecture']]
  ],
  /* What I am open to, said in one place and not buried in a paragraph. The
     CV button here renders on the same condition as the one in the bar: only
     when the file is actually in the repository. */
  open: {
    h: 'Open to work',
    body: 'Open to full-time Art Director / Creative Technologist roles and select freelance projects.',
    terms: ['Authorized to work in Canada', 'open to relocation', 'remote-friendly']
  },
  cvLabel: 'Open CV (PDF)',
  /* The CV opens, it does not download: a reader deciding whether to keep
     reading should not have to take a file to find out. This is a Google Drive
     link, so it opens in its viewer in a new tab and the site keeps its place.
     Point cvHref back at /cv/artem-maslov-resume.pdf — the copy in this
     repository, still served — and the button goes back to being a download
     named by cvFile. Either way, no file and no link means no button. */
  cvHref: 'https://drive.google.com/file/d/1bp0j81obIgjLphkk6ELW8haJlf4uVngV/view?usp=sharing',
  cvFile: 'Artem Maslov — Resume.pdf'
};

/* Not rendered. Kept so the writing is not lost if it comes back. */
export const facts = [
  { id: 'f1', text: 'On days when I do not have to meet anyone, I eat something with garlic first thing in the morning.' },
  { id: 'f2', text: 'At four I wanted to be a scientist working at the edge of volcanoes, physics, chemistry and dinosaurs. This site is the closest I have come.' },
  { id: 'f3', text: 'My first password was built on Hebrew numerals, where every letter is a number: 120091040. Guess what it spells.' },
  { id: 'f4', text: 'I have lived in Ukraine, Montenegro, Portugal, the Netherlands and now Canada. One lesson from each:',
    lessons: [
      ['Ukraine', '[TODO: lesson]'],
      ['Montenegro', '[TODO: lesson]'],
      ['Portugal', '[TODO: lesson]'],
      ['Netherlands', '[TODO: lesson]'],
      ['Canada', '[TODO: lesson]']
    ] }
];

/* Not rendered. Kept so the values are not lost if the chart comes back. */
export const skills = {
  note: 'Self-assessed, 0 to 10. Hollow is 2016 to 2023, filled is 2024 onward. [TODO: replace the sample values with real ones]',
  axis: [[0, 'none'], [5, 'working'], [10, 'expert']],
  rows: [
    ['Art direction', 8, 9],
    ['Concept art', 9, 9],
    ['3D modeling and animation', 8, 8],
    ['AR and VR', 8, 8],
    ['AI image and video', 2, 9],
    ['Generative pipelines', 1, 8],
    ['Code', 2, 7],
    ['Math and technical thinking', 2, 6]
  ]
};

export const awards = [
  {
    year: '2025',
    what: 'Meta Horizon Creator Competition: Mobile Innovation — Best New User Onboarding Experience',
    note: 'Raft',
    href: '/lab/raft/'
  },
  {
    /* The award is Tactical's, not mine. I was on the team, and the Apple Vision Pro
       work Fast Company cites is the Visit Dubai project. Said plainly in the row. */
    year: '2024',
    what: 'Fast Company Middle East, Most Innovative Companies — Augmented & Virtual Reality',
    note: 'Visit Dubai',
    sub: 'The award is Tactical\u2019s. I was on the team, art directing.',
    href: 'https://fastcompanyme.com/most-innovative-companies/2024/augmented-and-virtual-reality-2/'
  }
];

/* Writing about the work, by other people. */
export const press = [
  {
    where: 'Devpost',
    what: 'How a former ship navigator and a Snapchat veteran built a VR world in one week',
    note: 'An interview with Pavlo Tkachenko and me about building Raft.',
    year: '2025',
    href: 'https://info.devpost.com/blog/user-story-pavlo-artem'
  }
];

/* About as a node graph. Positions are the untouched layout; nodes are draggable. */
export const graph = {
  w: 2240,
  h: 620,
  /* Each node declares named ports. A wire names the socket at both ends, so
     the graph reads the way a node editor reads: not "this feeds that", but
     "this character goes into that character input". */
  nodes: [
    { id: 'origin', kind: 'load', title: 'origin', x: 16, y: 16,
      out: [['character', 'character'], ['curiosity', 'curiosity'], ['will', 'will']],
      rows: [['place', 'Odesa, Ukraine'], ['period', 'Jurassic'], ['seed', '1048576042']] },

    { id: 'formation', kind: 'load', title: 'formation', x: 296, y: 16,
      in: [['character', 'character']],
      out: [['skills', 'skills']],
      rows: [
        ['first school', 'Streets of Odesa'],
        ['degree', 'BFA'],
        ['institution', 'Odesa State Academy of Civil Engineering and Architecture']
      ] },

    { id: 'snap', kind: 'sampler', title: 'Snap Inc.', x: 576, y: 16,
      in: [['skills', 'skills'], ['curiosity', 'passion']],
      out: [['experience', 'experience']],
      rows: [['role', 'Senior concept artist'], ['ran for', '3.5 years']] },

    { id: 'arni', kind: 'sampler', title: 'ARNI', x: 856, y: 16,
      in: [['experience', 'experience'], ['will', 'will']],
      out: [['experience', 'experience']],
      rows: [['role', 'Founder'], ['closed', '2022']] },

    { id: 'ai', kind: 'model', title: 'ai, 2024', x: 296, y: 286,
      in: [['curiosity', 'curiosity']],
      out: [['pipelines', 'pipelines']],
      rows: [['loaded', 'Code, node graphs, generative pipelines']] },

    { id: 'tactical', kind: 'sampler', title: 'Tactical', x: 1136, y: 16,
      in: [['experience', 'experience']],
      out: [['experience', 'experience']],
      rows: [['role', 'Associate art director'], ['years', '2023 to 2025'], ['place', 'Rotterdam']] },

    { id: 'freelance', kind: 'sampler', title: 'freelance', x: 1416, y: 16,
      in: [['experience', 'experience'], ['pipelines', 'pipelines']],
      out: [['experience', 'experience']],
      rows: [['role', 'Creative Technologist & Art Director'], ['years', '2025 to now'], ['place', 'Edmonton']] },

    { id: 'nait', kind: 'save', title: 'NAIT', x: 1696, y: 16,
      in: [['experience', 'experience']],
      out: [['teaching', 'teaching']],
      rows: [['course', 'GDEV 1015, Visual Assets for Games'], ['role', 'Casual instructor'], ['from', '2026']] },

    { id: 'merge', kind: 'merge', title: 'merge', x: 1696, y: 286,
      in: [['experience', 'experience']],
      out: [['artist', 'artist']],
      rows: [['taste', '1.00'], ['craft', '1.00'], ['compute', '1.00'], ['curiosity', 'infinite']] },

    { id: 'output', kind: 'output', title: 'output, 2026', x: 1976, y: 150,
      in: [['artist', 'artist'], ['teaching', 'teaching']],
      rows: [['name', 'Artem Maslov'], ['role', 'Creative Technologist & Art Director'], ['email', 'artem@artmaslov.com']] }
  ],
  /* [from node, from socket, to node, to socket] */
  wires: [
    ['origin', 'character', 'formation', 'character'],
    ['origin', 'curiosity', 'snap', 'curiosity'],
    ['origin', 'curiosity', 'ai', 'curiosity'],
    ['origin', 'will', 'arni', 'will'],
    ['formation', 'skills', 'snap', 'skills'],
    ['snap', 'experience', 'arni', 'experience'],
    ['arni', 'experience', 'tactical', 'experience'],
    ['tactical', 'experience', 'freelance', 'experience'],
    ['ai', 'pipelines', 'freelance', 'pipelines'],
    ['freelance', 'experience', 'nait', 'experience'],
    ['freelance', 'experience', 'merge', 'experience'],
    ['nait', 'teaching', 'output', 'teaching'],
    ['merge', 'artist', 'output', 'artist']
  ]
};

