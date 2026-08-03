/* ============================================================
   Java Track — zero to mastery
   Same challenge schema as track-python.js.

   User code is spliced into the body of `class Main`, so everything
   you write must be a STATIC member: `static int foo()`,
   `static class Bar { ... }`, `interface Baz { ... }`.

   The class is deliberately not `public`: the remote compiler names
   the source file <source>, and a public class must live in a file
   matching its own name.

   `call` / `expect` are Java expressions evaluated inside main().
   The harness boxes both sides and compares with Objects.equals
   (arrays are compared by content).

   Helper available in every case:
     __throws(() -> expr, SomeException.class) -> boolean
   ============================================================ */

export const javaTiers = [
  { id: 'fundamentals', name: 'Fundamentals',  blurb: 'Types, loops, arrays, StringBuilder.' },
  { id: 'collections',  name: 'Collections',   blurb: 'List, Map, Set and the Comparator toolkit.' },
  { id: 'oop',          name: 'Object Design', blurb: 'Encapsulation, equals/hashCode, immutability.' },
  { id: 'generics',     name: 'Generics & Interfaces', blurb: 'Type parameters, bounds, polymorphism.' },
  { id: 'streams',      name: 'Streams & Functional', blurb: 'Pipelines, collectors, Optional.' },
  { id: 'concurrency',  name: 'Concurrency',   blurb: 'Executors, futures, atomics.' },
];

export const javaChallenges = [
  /* -------------------------------------------------------- Fundamentals */
  {
    id: 'jv-f1',
    title: 'StringBuilder Discipline',
    tier: 'fundamentals',
    difficulty: 1,
    xp: 45,
    concepts: ['strings', 'loops', 'stringbuilder'],
    brief: `\`static String repeatJoin(String token, int times, String sep)\`

Repeat \`token\` \`times\` times, separated by \`sep\`.
\`repeatJoin("ab", 3, "-")\` → \`"ab-ab-ab"\`. \`times <= 0\` → \`""\`.

Build it with a \`StringBuilder\`. String concatenation inside a loop is O(n²) and the efficiency rubric checks for it.`,
    starter: `static String repeatJoin(String token, int times, String sep) {\n    return null;\n}\n`,
    solution: `static String repeatJoin(String token, int times, String sep) {\n    if (times <= 0) {\n        return "";\n    }\n    StringBuilder out = new StringBuilder(token);\n    for (int i = 1; i < times; i++) {\n        out.append(sep).append(token);\n    }\n    return out.toString();\n}\n`,
    hints: [
      'Seed the builder with the first token, then append sep+token for the rest — no trailing separator to trim.',
      'Guard `times <= 0` before touching the builder.',
    ],
    cases: [
      { name: 'three times', call: 'repeatJoin("ab", 3, "-")', expect: '"ab-ab-ab"' },
      { name: 'once', call: 'repeatJoin("x", 1, ",")', expect: '"x"' },
      { name: 'zero times', call: 'repeatJoin("x", 0, ",")', expect: '""' },
      { name: 'negative times', call: 'repeatJoin("x", -4, ",")', expect: '""', hidden: true },
      { name: 'empty separator', call: 'repeatJoin("ha", 3, "")', expect: '"hahaha"', hidden: true },
    ],
    budgetMs: 60,
    refLines: 10,
    quality: [
      { id: 'builder', label: 'Uses StringBuilder', weight: 50, re: /StringBuilder/ },
      { id: 'guard', label: 'Guards the non-positive case', weight: 30, re: /times\s*<=?\s*0/ },
      { id: 'no-print', label: 'Returns instead of printing', weight: 20, re: /System\.out\.print/, negative: true },
    ],
    efficiency: [
      { id: 'no-concat-loop', label: 'No String += inside the loop', weight: 100, re: /for\s*\([\s\S]{0,200}\w+\s*\+=\s*(token|sep|")/, negative: true },
    ],
  },

  {
    id: 'jv-f2',
    title: 'Matrix Transpose',
    tier: 'fundamentals',
    difficulty: 2,
    xp: 60,
    concepts: ['arrays', 'loops', 'indexing'],
    brief: `\`static int[][] transpose(int[][] m)\`

Return the transpose of a rectangular matrix. A \`3×2\` input becomes \`2×3\`.
An empty matrix (\`new int[0][0]\`) transposes to an empty matrix.

Watch the dimension bookkeeping — the output's row count is the input's column count.`,
    starter: `static int[][] transpose(int[][] m) {\n    return null;\n}\n`,
    solution: `static int[][] transpose(int[][] m) {\n    if (m.length == 0 || m[0].length == 0) {\n        return new int[0][0];\n    }\n    int rows = m.length;\n    int cols = m[0].length;\n    int[][] out = new int[cols][rows];\n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) {\n            out[c][r] = m[r][c];\n        }\n    }\n    return out;\n}\n`,
    hints: [
      'Allocate `new int[cols][rows]` — the dimensions swap.',
      '`out[c][r] = m[r][c]` is the whole transformation.',
      'Guard both `m.length == 0` and `m[0].length == 0`.',
    ],
    cases: [
      { name: '2x3 to 3x2', call: 'transpose(new int[][]{{1,2,3},{4,5,6}})', expect: 'new int[][]{{1,4},{2,5},{3,6}}' },
      { name: 'square', call: 'transpose(new int[][]{{1,2},{3,4}})', expect: 'new int[][]{{1,3},{2,4}}' },
      { name: 'single row', call: 'transpose(new int[][]{{7,8}})', expect: 'new int[][]{{7},{8}}' },
      { name: 'empty', call: 'transpose(new int[0][0]).length', expect: '0' },
      { name: 'double transpose is identity', call: 'transpose(transpose(new int[][]{{1,2,3},{4,5,6}}))', expect: 'new int[][]{{1,2,3},{4,5,6}}', hidden: true },
    ],
    budgetMs: 80,
    refLines: 14,
    quality: [
      { id: 'named-dims', label: 'Dimensions stored in named variables', weight: 40, re: /int\s+(rows|cols|nRows|nCols)\s*=/ },
      { id: 'guard', label: 'Handles the empty matrix', weight: 35, re: /\.length\s*==\s*0/ },
      { id: 'no-print', label: 'Returns instead of printing', weight: 25, re: /System\.out\.print/, negative: true },
    ],
    efficiency: [
      { id: 'single-pass', label: 'Exactly one nested pass over the cells', weight: 100, re: /for[\s\S]{0,300}for[\s\S]{0,300}for[\s\S]{0,200}for/, negative: true },
    ],
  },

  {
    id: 'jv-c1',
    title: 'Frequency Map & Top-K',
    tier: 'collections',
    difficulty: 2,
    xp: 70,
    concepts: ['maps', 'sorting', 'collections'],
    brief: `\`static List<String> topK(List<String> words, int k)\`

Return the \`k\` most frequent words, **count descending then alphabetically ascending**.

\`merge\` or \`getOrDefault\` builds the counts in one line; the sort is a two-stage \`Comparator\`.`,
    starter: `static List<String> topK(List<String> words, int k) {\n    return null;\n}\n`,
    solution: `static List<String> topK(List<String> words, int k) {\n    Map<String, Integer> counts = new HashMap<>();\n    for (String word : words) {\n        counts.merge(word, 1, Integer::sum);\n    }\n    List<String> ranked = new ArrayList<>(counts.keySet());\n    ranked.sort(\n        Comparator.comparingInt((String w) -> counts.get(w)).reversed()\n                  .thenComparing(Comparator.naturalOrder())\n    );\n    return ranked.subList(0, Math.min(k, ranked.size()));\n}\n`,
    hints: [
      '`counts.merge(word, 1, Integer::sum)` is the idiomatic counter increment.',
      '`Comparator.comparingInt(...).reversed().thenComparing(naturalOrder())` gives you both sort stages.',
      '`subList(0, Math.min(k, size))` avoids an IndexOutOfBounds when k is too large.',
    ],
    cases: [
      { name: 'simple', call: 'topK(Arrays.asList("a","b","a","c","a","b"), 2)', expect: 'Arrays.asList("a", "b")' },
      { name: 'alphabetical tiebreak', call: 'topK(Arrays.asList("b","a"), 2)', expect: 'Arrays.asList("a", "b")' },
      { name: 'k exceeds vocabulary', call: 'topK(Arrays.asList("solo"), 5)', expect: 'Arrays.asList("solo")' },
      { name: 'empty input', call: 'topK(new ArrayList<String>(), 3)', expect: 'new ArrayList<String>()' },
      { name: 'k = 0', call: 'topK(Arrays.asList("a","b"), 0)', expect: 'new ArrayList<String>()', hidden: true },
      { name: 'three-way tie', call: 'topK(Arrays.asList("c","b","a"), 3)', expect: 'Arrays.asList("a", "b", "c")', hidden: true },
    ],
    budgetMs: 120,
    refLines: 12,
    quality: [
      { id: 'merge', label: 'Counts with merge/getOrDefault/compute', weight: 40, re: /\.merge\s*\(|getOrDefault|\.compute/ },
      { id: 'comparator', label: 'Uses the Comparator combinators', weight: 35, re: /Comparator\.|thenComparing/ },
      { id: 'bounds', label: 'Bounds k against the actual size', weight: 25, re: /Math\.min/ },
    ],
    efficiency: [
      { id: 'no-nested-count', label: 'No O(n²) counting via indexOf/frequency in a loop', weight: 100, re: /for[\s\S]{0,200}Collections\.frequency|for[\s\S]{0,200}\.indexOf\s*\(/, negative: true },
    ],
  },

  {
    id: 'jv-o2',
    title: 'Interfaces & Polymorphism',
    tier: 'oop',
    difficulty: 2,
    xp: 75,
    concepts: ['interfaces', 'polymorphism', 'default-methods'],
    brief: `\`\`\`java
interface Shape {
    double area();
    String name();
    default String describe() { ... }   // "circle: 12.57"
}
\`\`\`

Implement \`Circle\` and \`Square\`, write the \`describe\` **default method** (area to 2 decimals), and:

\`static double totalArea(List<Shape> shapes)\`

The default method must live in the interface, not be duplicated in both classes.`,
    starter: `interface Shape {\n    double area();\n    String name();\n}\n\nstatic class Circle implements Shape {\n    private final double radius;\n    Circle(double radius) { this.radius = radius; }\n}\n\nstatic class Square implements Shape {\n    private final double side;\n    Square(double side) { this.side = side; }\n}\n\nstatic double totalArea(List<Shape> shapes) {\n    return 0;\n}\n`,
    solution: `interface Shape {\n    double area();\n    String name();\n\n    default String describe() {\n        return String.format("%s: %.2f", name(), area());\n    }\n}\n\nstatic class Circle implements Shape {\n    private final double radius;\n    Circle(double radius) { this.radius = radius; }\n    public double area() { return Math.PI * radius * radius; }\n    public String name() { return "circle"; }\n}\n\nstatic class Square implements Shape {\n    private final double side;\n    Square(double side) { this.side = side; }\n    public double area() { return side * side; }\n    public String name() { return "square"; }\n}\n\nstatic double totalArea(List<Shape> shapes) {\n    double total = 0;\n    for (Shape s : shapes) {\n        total += s.area();\n    }\n    return total;\n}\n`,
    hints: [
      'A `default` method in an interface has a body and is inherited by every implementer.',
      'Interface methods are implicitly public — your implementations must be `public` too.',
      '`String.format("%.2f", x)` gives the two-decimal rendering.',
    ],
    cases: [
      { name: 'square area', call: 'new Square(3).area()', expect: '9.0' },
      { name: 'circle describe', call: 'new Circle(2).describe()', expect: '"circle: 12.57"' },
      { name: 'square describe', call: 'new Square(2.5).describe()', expect: '"square: 6.25"' },
      { name: 'total over mixed list', call: 'totalArea(Arrays.asList(new Square(2), new Square(3)))', expect: '13.0' },
      { name: 'empty list', call: 'totalArea(new ArrayList<Shape>())', expect: '0.0', hidden: true },
      { name: 'polymorphic dispatch', call: '((Shape) new Circle(1)).name()', expect: '"circle"', hidden: true },
    ],
    budgetMs: 80,
    refLines: 26,
    quality: [
      { id: 'default-method', label: 'describe() is an interface default method', weight: 50, re: /interface\s+Shape[\s\S]{0,300}default\s+String\s+describe/ },
      { id: 'final-fields', label: 'Implementation state is final', weight: 25, re: /private\s+final/ },
      { id: 'no-dup', label: 'describe not duplicated in the classes', weight: 25, re: /class\s+Circle[\s\S]{0,400}String\s+describe\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'math-pi', label: 'Uses Math.PI, not a hard-coded 3.14', weight: 100, re: /Math\.PI/ },
    ],
  },

  {
    id: 'jv-c2',
    title: 'Multi-Key Sorting',
    tier: 'collections',
    difficulty: 3,
    xp: 80,
    concepts: ['comparators', 'sorting', 'collections'],
    brief: `Given this class (already in your starter):

\`\`\`java
static class Employee {
    String name; String dept; int salary;
}
\`\`\`

Implement \`static List<String> sortedNames(List<Employee> staff)\` returning employee names sorted by:

1. department **ascending**
2. then salary **descending**
3. then name **ascending**

Build it as a chained \`Comparator\` — not a hand-rolled \`compare\` with nested if-statements.`,
    starter: `static class Employee {\n    String name;\n    String dept;\n    int salary;\n\n    Employee(String name, String dept, int salary) {\n        this.name = name;\n        this.dept = dept;\n        this.salary = salary;\n    }\n}\n\nstatic List<String> sortedNames(List<Employee> staff) {\n    return null;\n}\n`,
    solution: `static class Employee {\n    String name;\n    String dept;\n    int salary;\n\n    Employee(String name, String dept, int salary) {\n        this.name = name;\n        this.dept = dept;\n        this.salary = salary;\n    }\n}\n\nstatic List<String> sortedNames(List<Employee> staff) {\n    List<Employee> copy = new ArrayList<>(staff);\n    copy.sort(\n        Comparator.comparing((Employee e) -> e.dept)\n                  .thenComparing(Comparator.comparingInt((Employee e) -> e.salary).reversed())\n                  .thenComparing(e -> e.name)\n    );\n    List<String> names = new ArrayList<>();\n    for (Employee e : copy) {\n        names.add(e.name);\n    }\n    return names;\n}\n`,
    hints: [
      '`Comparator.comparing(...).thenComparing(...)` chains the keys in priority order.',
      'For a descending stage, reverse that stage only: `comparingInt(...).reversed()` inside thenComparing.',
      'Copy the input before sorting — mutating a caller\'s list is a design smell the rubric checks.',
    ],
    cases: [
      { name: 'dept then salary desc', call: 'sortedNames(Arrays.asList(new Employee("ann","eng",100), new Employee("bob","eng",200)))', expect: 'Arrays.asList("bob", "ann")' },
      { name: 'dept ordering wins', call: 'sortedNames(Arrays.asList(new Employee("zed","art",10), new Employee("ann","eng",999)))', expect: 'Arrays.asList("zed", "ann")' },
      { name: 'name tiebreak', call: 'sortedNames(Arrays.asList(new Employee("bob","eng",100), new Employee("ann","eng",100)))', expect: 'Arrays.asList("ann", "bob")' },
      { name: 'single employee', call: 'sortedNames(Arrays.asList(new Employee("solo","x",1)))', expect: 'Arrays.asList("solo")' },
      { name: 'empty', call: 'sortedNames(new ArrayList<Employee>())', expect: 'new ArrayList<String>()', hidden: true },
      { name: 'does not mutate input', call: '__preservesOrder()', expect: 'true', hidden: true },
    ],
    budgetMs: 120,
    refLines: 23,
    quality: [
      { id: 'chained', label: 'Uses chained Comparators', weight: 45, re: /thenComparing/ },
      { id: 'copy', label: 'Copies the list before sorting', weight: 30, re: /new\s+ArrayList\s*<\s*>\s*\(\s*staff\s*\)|new\s+ArrayList\s*<\s*Employee\s*>\s*\(\s*staff\s*\)/ },
      { id: 'no-manual-compare', label: 'No hand-rolled nested if comparator', weight: 25, re: /public\s+int\s+compare\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'single-sort', label: 'Sorts once, not once per key', weight: 100, re: /\.sort\s*\([\s\S]{0,400}\.sort\s*\(/, negative: true },
    ],
    preamble: `static boolean __preservesOrder() {\n    List<Employee> input = new ArrayList<>(Arrays.asList(\n        new Employee("zed", "eng", 10),\n        new Employee("ann", "art", 20)\n    ));\n    sortedNames(input);\n    return input.get(0).name.equals("zed");\n}\n`,
  },

  {
    id: 'jv-o1',
    title: 'Immutable Value Object',
    tier: 'oop',
    difficulty: 3,
    xp: 95,
    concepts: ['oop', 'immutability', 'equals-hashcode'],
    brief: `A \`Money\` value type that behaves correctly in a \`HashSet\`.

- \`Money(long cents, String currency)\` — negative cents or null/blank currency → \`IllegalArgumentException\`
- final fields, no setters
- \`plus(Money other)\` returns a **new** Money; mixing currencies → \`IllegalArgumentException\`
- \`equals\`/\`hashCode\` by value
- \`toString()\` → \`"12.34 USD"\`

Getting \`equals\` right without \`hashCode\` is the classic bug — the hidden test uses a HashSet.`,
    starter: `static class Money {\n    private final long cents;\n    private final String currency;\n\n    Money(long cents, String currency) {\n        // validate, then assign\n    }\n}\n`,
    solution: `static class Money {\n    private final long cents;\n    private final String currency;\n\n    Money(long cents, String currency) {\n        if (cents < 0) {\n            throw new IllegalArgumentException("cents must be non-negative");\n        }\n        if (currency == null || currency.trim().isEmpty()) {\n            throw new IllegalArgumentException("currency is required");\n        }\n        this.cents = cents;\n        this.currency = currency;\n    }\n\n    long getCents() { return cents; }\n\n    String getCurrency() { return currency; }\n\n    Money plus(Money other) {\n        if (!this.currency.equals(other.currency)) {\n            throw new IllegalArgumentException("currency mismatch");\n        }\n        return new Money(this.cents + other.cents, this.currency);\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Money)) return false;\n        Money other = (Money) o;\n        return cents == other.cents && currency.equals(other.currency);\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(cents, currency);\n    }\n\n    @Override\n    public String toString() {\n        return String.format("%d.%02d %s", cents / 100, cents % 100, currency);\n    }\n}\n`,
    hints: [
      'Validate in the constructor so an invalid Money can never exist.',
      '`Objects.hash(...)` is the one-liner for hashCode; it must use the same fields as equals.',
      '`String.format("%d.%02d %s", ...)` handles the zero-padded minor unit.',
    ],
    cases: [
      { name: 'toString', call: 'new Money(1234, "USD").toString()', expect: '"12.34 USD"' },
      { name: 'zero pads minor unit', call: 'new Money(1205, "GBP").toString()', expect: '"12.05 GBP"' },
      { name: 'plus returns new value', call: 'new Money(100, "USD").plus(new Money(50, "USD")).toString()', expect: '"1.50 USD"' },
      { name: 'equality by value', call: 'new Money(500, "USD").equals(new Money(500, "USD"))', expect: 'true' },
      { name: 'currency mismatch rejected', call: '__throws(() -> new Money(1, "USD").plus(new Money(1, "EUR")), IllegalArgumentException.class)', expect: 'true' },
      { name: 'negative rejected', call: '__throws(() -> new Money(-1, "USD"), IllegalArgumentException.class)', expect: 'true' },
      { name: 'works in a HashSet', call: 'new HashSet<>(Arrays.asList(new Money(1, "USD"), new Money(1, "USD"))).size()', expect: '1', hidden: true },
      { name: 'blank currency rejected', call: '__throws(() -> new Money(1, "  "), IllegalArgumentException.class)', expect: 'true', hidden: true },
      { name: 'not equal across currencies', call: 'new Money(1, "USD").equals(new Money(1, "EUR"))', expect: 'false', hidden: true },
    ],
    budgetMs: 100,
    refLines: 37,
    quality: [
      { id: 'final-fields', label: 'Fields are private final', weight: 30, re: /private\s+final/ },
      { id: 'both-eq-hash', label: 'Overrides both equals and hashCode', weight: 35, re: /hashCode\s*\(\s*\)[\s\S]*|equals\s*\(\s*Object/ },
      { id: 'objects-hash', label: 'Uses Objects.hash rather than a hand-rolled prime dance', weight: 20, re: /Objects\.hash/ },
      { id: 'override', label: '@Override annotations present', weight: 15, re: /@Override/ },
    ],
    efficiency: [
      { id: 'no-setters', label: 'No setters — genuinely immutable', weight: 100, re: /void\s+set[A-Z]/, negative: true },
    ],
  },

  {
    id: 'jv-g1',
    title: 'Bounded Generics',
    tier: 'generics',
    difficulty: 3,
    xp: 90,
    concepts: ['generics', 'bounds', 'type-parameters'],
    brief: `Two generic utilities plus a generic container:

- \`static <T extends Comparable<T>> T maxOf(List<T> items)\` — null/empty returns \`null\`
- \`static <T> int countWhere(List<T> items, Predicate<T> test)\`
- \`static class Pair<A, B>\` with \`getFirst()\`, \`getSecond()\`, and \`Pair<B, A> swapped()\`

The bound \`T extends Comparable<T>\` is the point — it is what lets you call \`compareTo\`.`,
    starter: `static <T extends Comparable<T>> T maxOf(List<T> items) {\n    return null;\n}\n\nstatic <T> int countWhere(List<T> items, Predicate<T> test) {\n    return 0;\n}\n\nstatic class Pair<A, B> {\n    private final A first;\n    private final B second;\n\n    Pair(A first, B second) {\n        this.first = first;\n        this.second = second;\n    }\n}\n`,
    solution: `static <T extends Comparable<T>> T maxOf(List<T> items) {\n    if (items == null || items.isEmpty()) {\n        return null;\n    }\n    T best = items.get(0);\n    for (T item : items) {\n        if (item.compareTo(best) > 0) {\n            best = item;\n        }\n    }\n    return best;\n}\n\nstatic <T> int countWhere(List<T> items, Predicate<T> test) {\n    int count = 0;\n    for (T item : items) {\n        if (test.test(item)) {\n            count++;\n        }\n    }\n    return count;\n}\n\nstatic class Pair<A, B> {\n    private final A first;\n    private final B second;\n\n    Pair(A first, B second) {\n        this.first = first;\n        this.second = second;\n    }\n\n    A getFirst() { return first; }\n\n    B getSecond() { return second; }\n\n    Pair<B, A> swapped() {\n        return new Pair<>(second, first);\n    }\n\n    @Override\n    public String toString() {\n        return "(" + first + ", " + second + ")";\n    }\n}\n`,
    hints: [
      '`T extends Comparable<T>` is what makes `item.compareTo(best)` compile.',
      '`Predicate<T>` from java.util.function already has `.test(x)`.',
      '`swapped()` returns `Pair<B, A>` — the type parameters flip in the signature too.',
    ],
    cases: [
      { name: 'max of integers', call: 'maxOf(Arrays.asList(3, 9, 2))', expect: '9' },
      { name: 'max of strings', call: 'maxOf(Arrays.asList("ada", "zoe", "bob"))', expect: '"zoe"' },
      { name: 'empty is null', call: 'maxOf(new ArrayList<Integer>())', expect: '(Integer) null' },
      { name: 'countWhere', call: 'countWhere(Arrays.asList(1, 2, 3, 4), x -> x % 2 == 0)', expect: '2' },
      { name: 'pair accessors', call: 'new Pair<>("a", 1).getSecond()', expect: '1' },
      { name: 'swapped', call: 'new Pair<>("a", 1).swapped().getFirst()', expect: '1' },
      { name: 'null list is null', call: 'maxOf((List<Integer>) null)', expect: '(Integer) null', hidden: true },
      { name: 'countWhere none', call: 'countWhere(Arrays.asList(1, 3), x -> x > 100)', expect: '0', hidden: true },
    ],
    budgetMs: 100,
    refLines: 38,
    quality: [
      { id: 'bound', label: 'Uses the Comparable bound', weight: 40, re: /<\s*T\s+extends\s+Comparable/ },
      { id: 'final-fields', label: 'Pair fields are final', weight: 30, re: /private\s+final\s+A|private\s+final\s+B/ },
      { id: 'diamond', label: 'Uses the diamond operator', weight: 30, re: /new\s+Pair\s*<\s*>/ },
    ],
    efficiency: [
      { id: 'no-raw-cast', label: 'No raw Object casts to dodge generics', weight: 100, re: /\(\s*Object\s*\)\s*\w+\s*\.\s*compareTo/, negative: true },
    ],
  },

  {
    id: 'jv-e1',
    title: 'Validation & Custom Exceptions',
    tier: 'generics',
    difficulty: 3,
    xp: 85,
    concepts: ['exceptions', 'validation', 'error-handling'],
    brief: `Define \`static class ValidationException extends Exception\` carrying a \`field\` name, then:

\`static void validateUser(String name, int age, String email) throws ValidationException\`

Rules, checked **in this order**:
1. name null/blank → field \`"name"\`
2. age < 0 or > 150 → field \`"age"\`
3. email missing \`"@"\` → field \`"email"\`

Passing input throws nothing. The exception message should be \`"invalid " + field\`.`,
    starter: `static class ValidationException extends Exception {\n    private final String field;\n\n    ValidationException(String field) {\n        super("invalid " + field);\n        this.field = field;\n    }\n\n    String getField() { return field; }\n}\n\nstatic void validateUser(String name, int age, String email) throws ValidationException {\n    // validate in order: name, age, email\n}\n`,
    solution: `static class ValidationException extends Exception {\n    private final String field;\n\n    ValidationException(String field) {\n        super("invalid " + field);\n        this.field = field;\n    }\n\n    String getField() { return field; }\n}\n\nstatic void validateUser(String name, int age, String email) throws ValidationException {\n    if (name == null || name.trim().isEmpty()) {\n        throw new ValidationException("name");\n    }\n    if (age < 0 || age > 150) {\n        throw new ValidationException("age");\n    }\n    if (email == null || !email.contains("@")) {\n        throw new ValidationException("email");\n    }\n}\n`,
    hints: [
      'A checked exception extends Exception and must be declared with `throws`.',
      'Pass the message up with `super(...)` and keep the structured field alongside it.',
      'Order matters — the tests supply input that is invalid on more than one axis.',
    ],
    cases: [
      { name: 'valid input passes', call: '__fieldOf(() -> { validateUser("ada", 30, "a@b.com"); return null; })', expect: '(String) null' },
      { name: 'blank name', call: '__fieldOf(() -> { validateUser("  ", 30, "a@b.com"); return null; })', expect: '"name"' },
      { name: 'age too high', call: '__fieldOf(() -> { validateUser("ada", 200, "a@b.com"); return null; })', expect: '"age"' },
      { name: 'bad email', call: '__fieldOf(() -> { validateUser("ada", 30, "nope"); return null; })', expect: '"email"' },
      { name: 'name checked before age', call: '__fieldOf(() -> { validateUser(null, 999, "nope"); return null; })', expect: '"name"', hidden: true },
      { name: 'negative age', call: '__fieldOf(() -> { validateUser("ada", -1, "a@b.com"); return null; })', expect: '"age"', hidden: true },
      { name: 'is a checked exception', call: 'Exception.class.isAssignableFrom(ValidationException.class) && !RuntimeException.class.isAssignableFrom(ValidationException.class)', expect: 'true', hidden: true },
    ],
    budgetMs: 100,
    refLines: 19,
    quality: [
      { id: 'checked', label: 'Extends Exception (checked), not RuntimeException', weight: 35, re: /class\s+ValidationException\s+extends\s+Exception/ },
      { id: 'structured', label: 'Carries the structured field, not just a string', weight: 35, re: /private\s+final\s+String\s+field/ },
      { id: 'super-message', label: 'Passes a message to super()', weight: 30, re: /super\s*\(/ },
    ],
    efficiency: [
      { id: 'no-swallow', label: 'No empty catch blocks swallowing errors', weight: 100, re: /catch\s*\([^)]*\)\s*\{\s*\}/, negative: true },
    ],
    preamble: `interface __ThrowingSupplier { String get() throws Exception; }\n\nstatic String __fieldOf(__ThrowingSupplier s) {\n    try {\n        return s.get();\n    } catch (ValidationException e) {\n        return e.getField();\n    } catch (Exception e) {\n        return "unexpected:" + e.getClass().getSimpleName();\n    }\n}\n`,
  },

  {
    id: 'jv-s1',
    title: 'Stream Pipelines',
    tier: 'streams',
    difficulty: 4,
    xp: 105,
    concepts: ['streams', 'collectors', 'functional'],
    brief: `Three one-expression stream pipelines over \`List<String>\`:

- \`static Map<Integer, List<String>> byLength(List<String> words)\` — grouped by length
- \`static String initials(List<String> words)\` — first letter of each, uppercased, joined by \`"."\` → \`"A.B.C"\`
- \`static Optional<String> longestStartingWith(List<String> words, char c)\`

Each should be a single \`stream()...collect()\` chain. Loops with accumulators pass correctness but lose style marks.`,
    starter: `static Map<Integer, List<String>> byLength(List<String> words) {\n    return null;\n}\n\nstatic String initials(List<String> words) {\n    return null;\n}\n\nstatic Optional<String> longestStartingWith(List<String> words, char c) {\n    return Optional.empty();\n}\n`,
    solution: `static Map<Integer, List<String>> byLength(List<String> words) {\n    return words.stream().collect(Collectors.groupingBy(String::length));\n}\n\nstatic String initials(List<String> words) {\n    return words.stream()\n                .filter(w -> !w.isEmpty())\n                .map(w -> w.substring(0, 1).toUpperCase())\n                .collect(Collectors.joining("."));\n}\n\nstatic Optional<String> longestStartingWith(List<String> words, char c) {\n    return words.stream()\n                .filter(w -> !w.isEmpty() && w.charAt(0) == c)\n                .max(Comparator.comparingInt(String::length));\n}\n`,
    hints: [
      '`Collectors.groupingBy(String::length)` is the whole of byLength.',
      '`Collectors.joining(".")` handles the separator without a trailing dot.',
      '`stream().max(comparator)` already returns an Optional — no need to build one yourself.',
    ],
    cases: [
      { name: 'group by length', call: 'byLength(Arrays.asList("a", "bb", "cc")).get(2)', expect: 'Arrays.asList("bb", "cc")' },
      { name: 'initials', call: 'initials(Arrays.asList("ada", "bob", "cy"))', expect: '"A.B.C"' },
      { name: 'single initial', call: 'initials(Arrays.asList("solo"))', expect: '"S"' },
      { name: 'longest starting with', call: 'longestStartingWith(Arrays.asList("apple", "ant", "bee"), \'a\')', expect: 'Optional.of("apple")' },
      { name: 'no match is empty', call: 'longestStartingWith(Arrays.asList("bee"), \'z\')', expect: 'Optional.empty()' },
      { name: 'empty list groups to empty map', call: 'byLength(new ArrayList<String>()).size()', expect: '0', hidden: true },
      { name: 'initials of empty list', call: 'initials(new ArrayList<String>())', expect: '""', hidden: true },
      { name: 'skips empty strings', call: 'initials(Arrays.asList("ab", "", "cd"))', expect: '"A.C"', hidden: true },
    ],
    budgetMs: 150,
    refLines: 14,
    quality: [
      { id: 'streams', label: 'Uses stream pipelines', weight: 40, re: /\.stream\s*\(\s*\)/ },
      { id: 'collectors', label: 'Uses Collectors (groupingBy / joining)', weight: 35, re: /Collectors\./ },
      { id: 'method-ref', label: 'Uses at least one method reference', weight: 25, re: /::/ },
    ],
    efficiency: [
      { id: 'no-manual-loop', label: 'No manual accumulation loops', weight: 100, re: /for\s*\(\s*String\s+\w+\s*:/, negative: true },
    ],
  },

  {
    id: 'jv-x1',
    title: 'Executors & Futures',
    tier: 'concurrency',
    difficulty: 4,
    xp: 125,
    concepts: ['concurrency', 'executors', 'futures', 'atomics'],
    brief: `\`static long parallelSum(List<List<Integer>> chunks, int threads)\`

Submit each chunk to a fixed thread pool, collect the \`Future<Long>\` partials, and sum them. Shut the pool down in a \`finally\` — a leaked executor keeps the JVM alive.

\`static int contendedCounter(int perThread)\`

One **worker thread** and the **main thread** each increment a shared \`AtomicInteger\` \`perThread\` times. Join the worker, then return the total — which must always be exactly \`2 * perThread\`.

That second one is the whole lesson in miniature: two threads hammering one counter. Swap the \`AtomicInteger\` for a plain \`int\` and the hidden high-iteration test will start losing updates.

*Note:* the shared remote JVM only permits one live worker thread, so the tests use a single worker with high iteration counts. The contention is genuine — the thread count is just polite. Point the playground at your own Piston instance (Profile → runner) if you want to push wider pools.`,
    starter: `static long parallelSum(List<List<Integer>> chunks, int threads) {\n    return 0;\n}\n\nstatic int contendedCounter(int perThread) {\n    return 0;\n}\n`,
    solution: `static long parallelSum(List<List<Integer>> chunks, int threads) {\n    if (chunks.isEmpty()) {\n        return 0L;\n    }\n    ExecutorService pool = Executors.newFixedThreadPool(Math.max(1, threads));\n    try {\n        List<Future<Long>> futures = new ArrayList<>();\n        for (List<Integer> chunk : chunks) {\n            futures.add(pool.submit(() -> {\n                long partial = 0L;\n                for (int value : chunk) {\n                    partial += value;\n                }\n                return partial;\n            }));\n        }\n        long total = 0L;\n        for (Future<Long> future : futures) {\n            total += future.get();\n        }\n        return total;\n    } catch (Exception e) {\n        throw new RuntimeException(e);\n    } finally {\n        pool.shutdown();\n    }\n}\n\nstatic int contendedCounter(int perThread) {\n    AtomicInteger counter = new AtomicInteger();\n\n    Thread worker = new Thread(() -> {\n        for (int i = 0; i < perThread; i++) {\n            counter.incrementAndGet();\n        }\n    });\n    worker.start();\n\n    for (int i = 0; i < perThread; i++) {\n        counter.incrementAndGet();\n    }\n\n    try {\n        worker.join();\n    } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();\n    }\n    return counter.get();\n}\n`,
    hints: [
      'Submit every task first, then call `future.get()` in a second loop — getting inside the submit loop serialises everything.',
      '`pool.shutdown()` belongs in a `finally` so it runs even when a task throws.',
      'Start the worker, do the main thread\'s share while it runs, and only then join — starting and immediately joining gives you no overlap and no contention.',
    ],
    cases: [
      { name: 'two chunks', call: 'parallelSum(Arrays.asList(Arrays.asList(1,2,3), Arrays.asList(4,5)), 1)', expect: '15L' },
      { name: 'no chunks', call: 'parallelSum(new ArrayList<List<Integer>>(), 1)', expect: '0L' },
      { name: 'contended counter', call: 'contendedCounter(1000)', expect: '2000' },
      { name: 'more chunks than pool threads', call: 'parallelSum(Arrays.asList(Arrays.asList(1), Arrays.asList(2), Arrays.asList(3), Arrays.asList(4)), 1)', expect: '10L', hidden: true },
      { name: 'no lost updates at 50k iterations', call: 'contendedCounter(50000)', expect: '100000', hidden: true },
      { name: 'zero iterations', call: 'contendedCounter(0)', expect: '0', hidden: true },
    ],
    budgetMs: 3000,
    refLines: 45,
    quality: [
      { id: 'executor', label: 'Uses an ExecutorService', weight: 25, re: /ExecutorService|Executors\.new/ },
      { id: 'shutdown', label: 'Shuts the pool down', weight: 25, re: /\.shutdown\s*\(\s*\)/ },
      { id: 'atomic', label: 'Uses AtomicInteger rather than a raw int', weight: 20, re: /AtomicInteger/ },
      { id: 'finally', label: 'Shutdown guarded by finally', weight: 15, re: /finally\s*\{/ },
      { id: 'overlap', label: 'Main thread does its share before joining', weight: 15, re: /start\s*\(\s*\)[\s\S]{0,500}\bfor\b[\s\S]{0,300}join\s*\(\s*\)/ },
    ],
    efficiency: [
      { id: 'submit-then-get', label: 'Submits all tasks before collecting results', weight: 100, re: /submit\s*\([\s\S]{0,300}\)\s*\.get\s*\(\s*\)/, negative: true },
    ],
  },
];
