import type { Program } from '@/types/program'

/**
 * Launch catalogue — docs/00 M1.
 *
 * Task briefs here are real and public by design: docs/01 FR-1.2 requires the
 * complete syllabus to be visible before payment. A program cannot be marked
 * PUBLISHED without `totalTaskCount` complete briefs (docs/06 §4.5).
 */
export const PROGRAMS: Program[] = [
  {
    id: 'prg_web_development',
    slug: 'web-development',
    title: 'Web Development',
    tagline: 'Ship three production-shaped web apps.',
    summary:
      'Build and deploy three real applications — not tutorials. You will handle state, persistence, authentication flows and deployment, and get your code read line by line.',
    domain: 'WEB_DEVELOPMENT',
    level: 'BEGINNER',
    durationWeeks: 4,
    totalTaskCount: 3,
    requiredTaskCount: 2,
    priceAmountMinor: 79900,
    currency: 'INR',
    status: 'PUBLISHED',
    sortOrder: 1,
    stack: ['HTML', 'CSS', 'JavaScript', 'React', 'REST APIs', 'Git'],
    tasks: [
      {
        id: 'tsk_web_1',
        position: 1,
        title: 'Responsive portfolio with a working contact form',
        brief:
          'Build a personal portfolio that holds up on a 360px phone as well as a 1440px desktop. The contact form must actually submit somewhere and handle its own error states — a form that silently fails is not done.',
        requirements: [
          'Fully responsive from 320px upward, no horizontal scroll at any width',
          'Contact form with client and server-side validation and visible error states',
          'Lighthouse performance score of 90+ on mobile',
          'Deployed to a public URL, source in a public GitHub repo',
        ],
        estimatedHours: 8,
        isRequired: true,
      },
      {
        id: 'tsk_web_2',
        position: 2,
        title: 'Data-driven dashboard consuming a public API',
        brief:
          'Consume a real third-party API and present it usefully. The interesting part is not the happy path — it is loading, empty, error and rate-limited states, and what your UI does when the network is slow.',
        requirements: [
          'Search, filter and pagination that work together without losing state',
          'Designed loading, empty and error states — no bare spinners',
          'Requests debounced and cancelled on unmount',
          'No API keys committed to the repository',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_web_3',
        position: 3,
        title: 'Full-stack CRUD app with authentication',
        brief:
          'A complete application with a database behind it. Users sign up, sign in, and can only see and modify their own records. Authorisation is the whole point of this task.',
        requirements: [
          'Persistent database with a documented schema',
          'Sign up, sign in, sign out with hashed passwords',
          'Every query scoped to the signed-in user — verified by attempting cross-user access',
          'Protected routes that fail closed, not open',
        ],
        estimatedHours: 16,
        isRequired: false,
      },
    ],
  },
  {
    id: 'prg_python',
    slug: 'python-programming',
    title: 'Python Programming',
    tagline: 'Write Python that other people can run.',
    summary:
      'Three projects that move you from scripts to software: command-line tools with real argument handling, file and data processing, and an HTTP API with tests.',
    domain: 'PYTHON',
    level: 'BEGINNER',
    durationWeeks: 4,
    totalTaskCount: 3,
    requiredTaskCount: 2,
    priceAmountMinor: 79900,
    currency: 'INR',
    status: 'PUBLISHED',
    sortOrder: 2,
    stack: ['Python 3', 'argparse', 'pytest', 'FastAPI', 'SQLite'],
    tasks: [
      {
        id: 'tsk_py_1',
        position: 1,
        title: 'Command-line tool with real argument handling',
        brief:
          'A CLI someone else could install and use without reading your source. Proper flags, helpful `--help` output, meaningful exit codes, and errors that tell the user what to do next.',
        requirements: [
          'Subcommands and flags via argparse or click',
          'Non-zero exit codes on failure, with actionable error messages',
          'README with installation and at least three usage examples',
          'No crash on malformed input — handled and reported',
        ],
        estimatedHours: 8,
        isRequired: true,
      },
      {
        id: 'tsk_py_2',
        position: 2,
        title: 'Data processing pipeline with tests',
        brief:
          'Read messy input, clean it, transform it, and write structured output. Real data has missing fields, wrong types and duplicates — your pipeline must survive all three.',
        requirements: [
          'Handles missing values, duplicates and type errors without crashing',
          'pytest suite covering the happy path and at least four edge cases',
          'Streams large files rather than loading them entirely into memory',
          'Deterministic output for identical input',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_py_3',
        position: 3,
        title: 'REST API with persistence and validation',
        brief:
          'A working HTTP API with a database behind it. Every endpoint validates its input and returns a consistent error shape — no unhandled 500s.',
        requirements: [
          'Full CRUD with correct HTTP status codes',
          'Request validation with a consistent error response envelope',
          'Database persistence with migrations',
          'Interactive API docs and a test suite',
        ],
        estimatedHours: 16,
        isRequired: false,
      },
    ],
  },
  {
    id: 'prg_java',
    slug: 'java-programming',
    title: 'Java Programming',
    tagline: 'Object-oriented design you can defend in an interview.',
    summary:
      'Three projects covering core Java, collections, file I/O and JDBC — with an emphasis on class design decisions you can explain, not just code that compiles.',
    domain: 'JAVA',
    level: 'BEGINNER',
    durationWeeks: 4,
    totalTaskCount: 3,
    requiredTaskCount: 2,
    priceAmountMinor: 79900,
    currency: 'INR',
    status: 'PUBLISHED',
    sortOrder: 3,
    stack: ['Java 17', 'Collections', 'JUnit', 'JDBC', 'Maven'],
    tasks: [
      {
        id: 'tsk_java_1',
        position: 1,
        title: 'Console application with layered class design',
        brief:
          'A working console application where the class structure is the deliverable. Separation between model, service and presentation must be visible without reading every method.',
        requirements: [
          'Clear separation of model, service and UI layers',
          'Encapsulation enforced — no public mutable fields',
          'Custom exceptions for domain failures, not bare RuntimeException',
          'README explaining each class design decision',
        ],
        estimatedHours: 10,
        isRequired: true,
      },
      {
        id: 'tsk_java_2',
        position: 2,
        title: 'Collections and file persistence',
        brief:
          'Store, query and persist records to disk. Choose your collection types deliberately and be prepared to justify the choice on complexity grounds.',
        requirements: [
          'Deliberate collection choice with stated time complexity per operation',
          'File read/write with proper resource handling',
          'JUnit tests covering persistence round-trips',
          'Data survives an application restart',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_java_3',
        position: 3,
        title: 'JDBC application with a relational database',
        brief:
          'Connect to a real database. Parameterised queries only — a single string-concatenated query fails this task outright.',
        requirements: [
          'Parameterised statements throughout, no string concatenation in SQL',
          'Connection lifecycle handled with try-with-resources',
          'Schema with primary keys, foreign keys and at least one index',
          'Transactional multi-table writes',
        ],
        estimatedHours: 16,
        isRequired: false,
      },
    ],
  },
  {
    id: 'prg_data_science',
    slug: 'data-science',
    title: 'Data Science',
    tagline: 'From raw CSV to a defensible conclusion.',
    summary:
      'Three projects covering cleaning, exploratory analysis and a first predictive model — with the emphasis on being honest about what your results do and do not show.',
    domain: 'DATA_SCIENCE',
    level: 'INTERMEDIATE',
    durationWeeks: 4,
    totalTaskCount: 3,
    requiredTaskCount: 2,
    priceAmountMinor: 79900,
    currency: 'INR',
    status: 'PUBLISHED',
    sortOrder: 4,
    stack: ['Python', 'pandas', 'NumPy', 'matplotlib', 'scikit-learn'],
    tasks: [
      {
        id: 'tsk_ds_1',
        position: 1,
        title: 'Clean and profile a messy dataset',
        brief:
          'Take a deliberately messy dataset and make it analysable. Every decision you make about a missing value or an outlier must be written down and justified.',
        requirements: [
          'Documented handling of missing values, duplicates and outliers',
          'Before/after profile with row counts and distributions',
          'Reproducible notebook that runs top to bottom without manual steps',
          'A written note on what your cleaning choices might have biased',
        ],
        estimatedHours: 10,
        isRequired: true,
      },
      {
        id: 'tsk_ds_2',
        position: 2,
        title: 'Exploratory analysis with a written conclusion',
        brief:
          'Answer a specific question with the data and defend the answer. Charts are evidence, not decoration — every one must earn its place.',
        requirements: [
          'A stated question, answered explicitly',
          'At least four charts, each with labelled axes and a caption stating what it shows',
          'Correlation discussed without being mistaken for causation',
          'Conclusion section including stated limitations',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_ds_3',
        position: 3,
        title: 'Baseline predictive model, honestly evaluated',
        brief:
          'Train a model and evaluate it properly. A model with 99% accuracy on an imbalanced dataset is a failed task, not a good result.',
        requirements: [
          'Correct train/test split with no leakage',
          'Metrics appropriate to the problem, not accuracy alone',
          'Comparison against a naive baseline',
          'Written statement of where the model fails',
        ],
        estimatedHours: 16,
        isRequired: false,
      },
    ],
  },
  {
    id: 'prg_android',
    slug: 'android-development',
    title: 'Android Development',
    tagline: 'Apps that survive a rotation and a dead network.',
    summary:
      'Three Android projects covering layouts, state, local persistence and network calls — built with the lifecycle in mind rather than against it.',
    domain: 'ANDROID',
    level: 'INTERMEDIATE',
    durationWeeks: 4,
    totalTaskCount: 3,
    requiredTaskCount: 2,
    priceAmountMinor: 79900,
    currency: 'INR',
    status: 'PUBLISHED',
    sortOrder: 5,
    stack: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Coroutines'],
    tasks: [
      {
        id: 'tsk_android_1',
        position: 1,
        title: 'Multi-screen app with state that survives rotation',
        brief:
          'Navigation between at least three screens, with state held correctly. Rotating the device must not lose anything the user typed.',
        requirements: [
          'Three or more screens with working back navigation',
          'State survives configuration changes',
          'Responsive layout on both phone and tablet widths',
          'No hardcoded strings — all externalised to resources',
        ],
        estimatedHours: 10,
        isRequired: true,
      },
      {
        id: 'tsk_android_2',
        position: 2,
        title: 'Local persistence with Room',
        brief:
          'Store data on the device and query it. The app must be fully usable on the second launch with no network at all.',
        requirements: [
          'Room database with entities, DAO and a migration',
          'Full CRUD from the UI',
          'All database work off the main thread',
          'Works entirely offline after first launch',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_android_3',
        position: 3,
        title: 'Network layer with real failure handling',
        brief:
          'Fetch from a remote API and cache locally. Aeroplane mode is a first-class test case, not an afterthought.',
        requirements: [
          'Retrofit + coroutines with structured concurrency',
          'Loading, empty, error and offline states designed and implemented',
          'Responses cached locally and served when offline',
          'No network calls on the main thread',
        ],
        estimatedHours: 16,
        isRequired: false,
      },
    ],
  },
  {
    id: 'prg_cpp_dsa',
    slug: 'cpp-dsa',
    title: 'C++ & DSA',
    tagline: 'Data structures you implement, not import.',
    summary:
      'Three projects where you build the data structures yourself and state the complexity of every operation — the foundation interview rounds actually test.',
    domain: 'CPP_DSA',
    level: 'INTERMEDIATE',
    durationWeeks: 4,
    totalTaskCount: 3,
    requiredTaskCount: 2,
    priceAmountMinor: 79900,
    currency: 'INR',
    status: 'PUBLISHED',
    sortOrder: 6,
    stack: ['C++17', 'STL', 'CMake', 'Google Test'],
    tasks: [
      {
        id: 'tsk_cpp_1',
        position: 1,
        title: 'Implement core data structures from scratch',
        brief:
          'Dynamic array, linked list and hash map, written by you. No STL containers in the implementations — the point is that you have built them.',
        requirements: [
          'Dynamic array with amortised O(1) push_back and documented growth strategy',
          'Singly linked list with insert, delete and search',
          'Hash map with a stated collision strategy',
          'Stated time and space complexity for every public operation',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_cpp_2',
        position: 2,
        title: 'Sorting and searching with measured performance',
        brief:
          'Implement several algorithms and measure them against each other. The deliverable is the measurement and the explanation, not just working code.',
        requirements: [
          'At least three sorting algorithms implemented',
          'Binary search on a sorted structure with correct boundary handling',
          'Benchmarks across input sizes with a results table',
          'Written explanation of why the measurements match or contradict theory',
        ],
        estimatedHours: 12,
        isRequired: true,
      },
      {
        id: 'tsk_cpp_3',
        position: 3,
        title: 'Graph algorithms on a real problem',
        brief:
          'Model a real problem as a graph and solve it. Explain your representation choice on memory and complexity grounds.',
        requirements: [
          'Graph representation chosen and justified against the alternative',
          'BFS and DFS implemented with correct cycle handling',
          'One shortest-path algorithm applied to a stated real problem',
          'Google Test suite including disconnected and empty-graph cases',
        ],
        estimatedHours: 16,
        isRequired: false,
      },
    ],
  },
]

export function getProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug && p.status === 'PUBLISHED')
}

export function getPublishedPrograms(): Program[] {
  return PROGRAMS.filter((p) => p.status === 'PUBLISHED').sort((a, b) => a.sortOrder - b.sortOrder)
}
