// Pure functions: a neutral default studio state and the prompt builder.
// No side effects here. The app reads/writes state; this file only transforms
// studio data into an image-generation prompt.
//
// buildPrompt and ITERATIONS are the same logic used in Andrea's private
// sketchnote canvas. defaultState here is neutral on purpose: the public app
// seeds real content from a GitHub handle instead of shipping one person's data.

export function defaultState() {
    return {
        profile: {
            name: "Your Name",
            title: "Developer",
            org: "Open source",
            roleSummary: "A developer who builds and shares things in public.",
            likenessNotes:
                "Use the uploaded reference image (a GitHub avatar works well) as the visual reference for the central portrait. Create a cute, clean cartoon whiteboard sketch version with photorealistic influence. Keep it warm, professional, recognizable, and do not over-caricature.",
            tone: "Warm, professional, human",
            audience: "Developers and community",
            useCase: "Profile, talk slide, or internal demo",
        },
        headshot: null, // { name, dataUrl } once set from a GitHub avatar or upload
        clusters: [
            {
                id: "languages",
                title: "Languages I use",
                items: ["JavaScript", "TypeScript", "Python"],
                icons: "code brackets, terminal window, file icons",
            },
            {
                id: "projects",
                title: "Projects I build",
                items: ["Open source tools", "Side projects", "Demos"],
                icons: "repo cards, git branches, stars, boxes",
            },
            {
                id: "focus",
                title: "What I focus on",
                items: ["Developer experience", "Automation", "Learning in public"],
                icons: "lightbulbs, arrows, tags, sticky notes",
            },
        ],
        collaborators: [],
        values: ["Curiosity", "Open source", "Learning in public", "Shipping"],
        journey: ["Started coding", "First open source contribution", "Building in public"],
        themes: ["Open source", "Developer tools", "Automation", "Community"],
        style: {
            style: "cute whiteboard sketchnote",
            detail: "rich, information-dense",
            realism: "photorealistic influence with clean cartoon finish",
            background: "whiteboard",
            accents: "teal, blue, yellow, coral, purple, black marker",
            layout: "central portrait with orbiting clusters",
            textDensity: "concise but meaningful",
            avatars: "generic icons only",
            orientation: "landscape",
            useCase: "Profile, talk slide, or internal demo",
        },
        iterations: [], // active iteration directive keys
        lastPrompt: "",
    };
}

// Iteration button label -> directive sentence added to the prompt.
export const ITERATIONS = {
    cuter: "Increase the cuteness and friendliness of the illustration.",
    "more-whiteboard":
        "Push the whiteboard marker sketch aesthetic: hand-drawn lines, marker textures, sticky notes.",
    "more-professional":
        "Make the composition more polished and professional while keeping it approachable.",
    "reduce-text": "Reduce the amount of text and rely more on icons and doodles.",
    "more-github":
        "Add more GitHub and developer visual motifs: Octocat-style doodles, terminal windows, pull request cards, git branches.",
    "more-central":
        "Make the central portrait larger and clearly the focal point.",
    readability:
        "Improve readability: clearer label hierarchy, more spacing between clusters, legible hand lettering.",
    "demo-ready":
        "Optimize for a conference slide: bold focal point, high contrast, readable from a distance.",
    "generic-collabs":
        "Replace all collaborator names with unlabeled generic avatar icons and remove personal names.",
};

const bullets = (lines) => lines.map((l) => `- ${l}`).join("\n");

export function buildPrompt(state) {
    const p = state.profile;
    const s = state.style;
    const hideNames = state.iterations.includes("generic-collabs");

    const clusterBlocks = state.clusters
        .map(
            (c) =>
                `${c.title}:\n${c.items.join(", ")}.\nUse icons like ${c.icons}.`,
        )
        .join("\n\n");

    const collabBlock = hideNames
        ? "Create a collaboration network using unlabeled generic avatar icons only. Do not invent real faces and do not include personal names."
        : `Create a collaboration network using generic avatar icons only. Do not invent real faces.\nInclude labels for ${state.collaborators
              .map((c) => c.name)
              .join(", ")}.\nConnect the generic avatar nodes with hand-drawn relationship lines and small labels such as ${state.collaborators
              .map((c) => c.relationship)
              .filter(Boolean)
              .join(", ")}.`;

    const adjustments = state.iterations
        .map((key) => ITERATIONS[key])
        .filter(Boolean);

    const parts = [
        `Create a polished, cute, photorealistic whiteboard sketchnote infographic that visualizes ${p.name}'s work life.`,
        `Use the uploaded reference image as the central visual reference. ${p.likenessNotes}`,
        `Overall style:\n${bullets([
            "Cute clean cartoon whiteboard sketch",
            "Hand-drawn marker lines",
            "Sketchnote infographic with sticky notes, doodles, arrows, and speech bubbles",
            "Rounded sketch borders",
            "GitHub-inspired developer aesthetic",
            `${cap(s.background)} background with black marker outlines`,
            `Accent colors: ${s.accents}`,
            `Detail level: ${s.detail}`,
            `Text density: ${s.textDensity}`,
            "Rich in information, no empty space, balanced and readable",
            "Professional enough for a profile, a conference slide, and an internal demo",
        ])}`,
        `Portrait:\n${p.likenessNotes}\nRender with ${s.realism}.`,
        `Composition:\nLayout is ${s.layout}. Place ${p.name} in the center with the title:\n"${p.name} - ${p.title}"\n\nSurround ${p.name} with connected visual clusters:\n\n${clusterBlocks}`,
        `Collaborators:\n${collabBlock}`,
        `Values:\nCreate a prominent values cluster for ${state.values.join(
            ", ",
        )}.\nRepresent each value with small hand-drawn icons and visual metaphors.`,
        `My Journey:\nCreate an uplifting timeline with milestones: ${state.journey.join(
            ", ",
        )}.`,
        `Technologies + Themes:\nAdd a visual cloud of themes: ${state.themes.join(
            ", ",
        )}.`,
        `Orientation: ${s.orientation}. Intended use: ${s.useCase}.`,
    ];

    if (adjustments.length) {
        parts.push(`Adjustments:\n${bullets(adjustments)}`);
    }

    parts.push(
        "The final result should look like a premium sketchnote poster drawn on a giant whiteboard by a professional illustrator. It should be charming, human, visually rich, readable, and demo-worthy.",
    );

    return parts.join("\n\n");
}

function cap(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
