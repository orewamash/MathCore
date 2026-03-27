export interface LessonMeta {
  number: number;
  title: string;
  slug: string;
  accentHex: string;
  description: string;
  topics: { slug: string; title: string }[];
}

export const lessons: LessonMeta[] = [
  {
    number: 1,
    title: "Differential Calculus",
    slug: "differential-calculus",
    accentHex: "#A78BFA",
    description: "Understand conditions, conclusions, and geometric meaning of classical theorems.",
    topics: [
      { slug: "rolles-theorem", title: "Rolle's Theorem" },
      { slug: "lmvt", title: "Lagrange Mean Value Theorem" },
    ],
  },
  {
    number: 2,
    title: "Integral Calculus",
    slug: "integral-calculus",
    accentHex: "#6EE7B7",
    description: "Master integration techniques from parts to area and volume computation.",
    topics: [
      { slug: "integration-by-parts", title: "Integration by Parts" },
      { slug: "bernoullis-formula", title: "Bernoulli's Formula" },
      { slug: "double-integration", title: "Double Integration" },
      { slug: "triple-integration", title: "Triple Integration" },
    ],
  },
  {
    number: 3,
    title: "Multivariable Calculus",
    slug: "multivariable-calculus",
    accentHex: "#F47C7C",
    description: "Extend calculus to functions of two or more variables.",
    topics: [
      { slug: "eulers-theorem", title: "Euler's Theorem" },
      { slug: "jacobian", title: "Jacobian" },
      { slug: "maxima-minima", title: "Maxima & Minima of Two Variables" },
      { slug: "lagrange-multiplier", title: "Lagrange Multiplier" },
    ],
  },
  {
    number: 4,
    title: "Linear Systems",
    slug: "linear-systems",
    accentHex: "#8BACFF",
    description: "Solve systems of equations with three classic matrix methods.",
    topics: [
      { slug: "gauss-elimination", title: "Gauss Elimination" },
      { slug: "gauss-jordan", title: "Gauss-Jordan Method" },
      { slug: "lu-decomposition", title: "LU Decomposition" },
    ],
  },
  {
    number: 5,
    title: "Eigen Analysis",
    slug: "eigen-analysis",
    accentHex: "#F0C27A",
    description: "Find eigenvalues, eigenvectors, and verify the Cayley-Hamilton theorem.",
    topics: [
      { slug: "eigenvalues", title: "Eigenvalues" },
      { slug: "eigenvectors", title: "Eigenvectors" },
      { slug: "cayley-hamilton", title: "Cayley-Hamilton Theorem" },
    ],
  },
];

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return lessons.find((l) => l.slug === slug);
}
