/* ============================================================
   Rust — Intermediate lessons (traits, collections, concurrency)

   These extend the Rust course beyond the 12 beginner lessons.
   Imported by curriculum.js and merged into the main Rust array.
   ============================================================ */

export const rustExtraLessons = [
  /* ==================================================== 13 */
  {
    id: 'rs-l13',
    topic: 'traits-and-generics',
    difficulty: 'beginner',
    title: 'Traits: Shared Behaviour',
    minutes: 14,
    summary: 'Defining traits, implementing them for your own types, and using trait bounds to write generic functions.',
    objectives: ['Define a trait with method signatures', 'Implement a trait for a struct', 'Write a generic function with a trait bound'],
    blocks: [
      { t: 'text', md: 'A **trait** defines behaviour that types can share. Think of it as a contract: "any type implementing this trait must provide these methods."\n\n```rust\ntrait Summary {\n    fn summarise(&self) -> String;\n}\n```\n\nAny type that `impl Summary for ...` is **guaranteed** to have a `summarise` method. Generic code works against traits, not concrete types \u2014 this is Rust\'s answer to polymorphism without inheritance.' },
      { t: 'code', run: true, lang: 'rust', code: "trait Summary {\n    fn summarise(&self) -> String;\n}\n\nstruct Article {\n    headline: String,\n    body: String,\n}\n\nimpl Summary for Article {\n    fn summarise(&self) -> String {\n        format!(\"{}...{}\", self.headline, &self.body[..50.min(self.body.len())])\n    }\n}\n\nstruct Tweet {\n    username: String,\n    content: String,\n}\n\nimpl Summary for Tweet {\n    fn summarise(&self) -> String {\n        format!(\"@{}: {}\", self.username, self.content)\n    }\n}\n\nfn notify(item: &impl Summary) {\n    println!(\"Breaking: {}!\", item.summarise());\n}\n\nfn main() {\n    let article = Article {\n        headline: \"Rust 2024 Edition Ships\".into(),\n        body: \"The Rust team released the 2024 edition...\".into(),\n    };\n    let tweet = Tweet {\n        username: \"rustlang\".into(),\n        content: \"The 2024 edition is here!\".into(),\n    };\n    notify(&article);\n    notify(&tweet);\n}" },
      { t: 'text', md: '## Trait bounds with generics\n\nThe `impl Trait` syntax in `fn notify(item: &impl Summary)` is sugar for a generic with a trait bound: `fn notify<T: Summary>(item: &T)`. Both mean "any type T that implements Summary."\n\nThe angle-bracket form is needed when multiple parameters share the same type.' },
      {
        t: 'case',
        title: 'Case study \u2014 a payment processing system',
        md: 'Multiple payment methods (credit card, PayPal, crypto) all implement a `Payable` trait. A `checkout` function accepts anything that implements `Payable` \u2014 adding a new payment method means writing one `impl` block. The rest of the system never changes.',
        run: true,
        lang: 'rust',
        code: "trait Payable {\n    fn pay(&self, amount: f64) -> Result<String, String>;\n    fn method_name(&self) -> &'static str;\n}\n\nstruct CreditCard { last_four: String, limit: f64 }\nstruct PayPal { email: String }\n\nimpl Payable for CreditCard {\n    fn pay(&self, amount: f64) -> Result<String, String> {\n        if amount > self.limit { return Err(\"over limit\".into()); }\n        Ok(format!(\"charged {} to card ending {}\", amount, self.last_four))\n    }\n    fn method_name(&self) -> &'static str { \"credit card\" }\n}\n\nimpl Payable for PayPal {\n    fn pay(&self, amount: f64) -> Result<String, String> {\n        Ok(format!(\"sent {} from {}\", amount, self.email))\n    }\n    fn method_name(&self) -> &'static str { \"PayPal\" }\n}\n\nfn checkout(method: &impl Payable, amount: f64) {\n    match method.pay(amount) {\n        Ok(msg) => println!(\"{}: {}\", method.method_name(), msg),\n        Err(e) => println!(\"{} failed: {}\", method.method_name(), e),\n    }\n}\n\nfn main() {\n    let card = CreditCard { last_four: \"4242\".into(), limit: 500.0 };\n    let pp = PayPal { email: \"ada@example.com\".into() };\n    checkout(&card, 75.0);\n    checkout(&pp, 30.0);\n    checkout(&card, 600.0);\n}" },
      {
        t: 'try',
        prompt: 'Define a trait Describable with a method describe(&self) -> String. Then implement it for Book (has title: String, author: String) \u2014 return "<title> by <author>". Also write print_desc(item: &impl Describable) that prints the description.',
        lang: 'rust',
        starter: "trait Describable {\n    fn describe(&self) -> String;\n}\n\nstruct Book { title: String, author: String }\n\n// TODO: impl Describable for Book\n\nfn print_desc(item: &impl Describable) {\n    // TODO\n}\n",
        solution: "trait Describable {\n    fn describe(&self) -> String;\n}\n\nstruct Book { title: String, author: String }\n\nimpl Describable for Book {\n    fn describe(&self) -> String {\n        format!(\"{} by {}\", self.title, self.author)\n    }\n}\n\nfn print_desc(item: &impl Describable) {\n    println!(\"{}\", item.describe());\n}\n",
        hints: ['impl Describable for Book { fn describe(...) { format!("{} by {}", self.title, self.author) } }', 'print_desc takes &impl Describable and calls item.describe().', 'Use println! to print.'],
        cases: [
          { name: 'describes book', call: 'Book { title: "Dune".into(), author: "Herbert".into() }.describe()', expect: 'String::from("Dune by Herbert")' },
        ],
      },
      { t: 'quiz', q: 'What is the difference between `impl Trait` and `<T: Trait>`?', options: ['Nothing \u2014 they are identical in all cases', '`impl Trait` is for return types only', '`<T: Trait>` lets you name the type and use it in multiple places; `impl Trait` is sugar for when you do not need the name', '`impl Trait` is slower'], answer: 2, why: 'fn foo<T: Trait>(x: T, y: T) ensures x and y have the same concrete type. fn foo(x: impl Trait, y: impl Trait) allows different types. Use angle brackets when the type appears in multiple positions.' },
      {
        t: 'try',
        prompt: "Write a generic function largest<T: PartialOrd + Clone>(list: &[T]) -> Option<T> that returns the largest value in the slice, or None if the slice is empty.\n\nlargest(&[3, 7, 2, 9]) -> Some(9)\nlargest::<i32>(&[]) -> None\n\nThe trait bounds are given. You only need the body.",
        lang: 'rust',
        starter: "fn largest<T: PartialOrd + Clone>(list: &[T]) -> Option<T> {\n    todo!()\n}\n",
        solution: "fn largest<T: PartialOrd + Clone>(list: &[T]) -> Option<T> {\n    if list.is_empty() { return None; }\n    let mut max = list[0].clone();\n    for item in &list[1..] {\n        if item > &max { max = item.clone(); }\n    }\n    Some(max)\n}\n",
        hints: ['Return None for empty slices.', 'Start with the first element as max.', 'Iterate the rest, comparing each with >.'],
        cases: [
          { name: 'non-empty', call: 'largest(&[3, 7, 2, 9])', expect: 'Some(9)' },
          { name: 'empty', call: 'largest::<i32>(&[])', expect: 'None' },
        ],
      },
    ],
  },

  /* ==================================================== 14 */
  {
    id: 'rs-l14',
    topic: 'collections-and-iterators',
    difficulty: 'intermediate',
    title: 'Collections in Practice',
    minutes: 14,
    summary: 'Vec, HashMap, HashSet, and the patterns that replace what other languages do with loops and conditionals.',
    objectives: ['Choose the right collection for the task', 'Use entry() for idiomatic HashMap updates', 'Build transformation pipelines with iterators'],
    blocks: [
      { t: 'text', md: "Rust's standard collections cover almost everything:\n\n| Collection | Use when |\n|---|---|\n| Vec<T> | Ordered list, push/pop, indexed access |\n| HashMap<K, V> | Look up by key, count frequencies |\n| HashSet<T> | Uniqueness, membership tests |\n| VecDeque<T> | Push/pop at both ends |\n| BTreeMap<K, V> | Sorted key-value pairs |\n\nChoosing the right one is the first half of idiomatic Rust. The other half is using **iterators** to transform the data without intermediate allocations." },
      { t: 'code', run: true, lang: 'rust', code: "use std::collections::HashMap;\n\nfn main() {\n    let text = \"apple banana apple cherry banana apple\";\n    let mut counts = HashMap::new();\n    for word in text.split_whitespace() {\n        *counts.entry(word).or_insert(0) += 1;\n    }\n    println!(\"{counts:?}\");\n\n    let mut pairs: Vec<_> = counts.into_iter().collect();\n    pairs.sort_by(|a, b| b.1.cmp(&a.1));\n    println!(\"top 2: {:?}\", &pairs[..2]);\n}" },
      { t: 'text', md: '## The entry() API\n\n`map.entry(key).or_insert(default)` is the idiomatic way to "get or insert." It returns `&mut V` \u2014 you dereference and mutate it in place. This replaces the "check then insert" pattern with a single lookup.' },
      {
        t: 'case',
        title: 'Case study \u2014 grouping records by category',
        md: 'A list of transactions, each with a category and amount. Group them by category and sum the amounts \u2014 a classic "map-reduce" pattern.',
        run: true,
        lang: 'rust',
        code: "use std::collections::HashMap;\n\nstruct Transaction { category: String, amount: f64 }\n\nfn group_by_category(txns: &[Transaction]) -> HashMap<String, f64> {\n    let mut totals = HashMap::new();\n    for txn in txns {\n        *totals.entry(txn.category.clone()).or_insert(0.0) += txn.amount;\n    }\n    totals\n}\n\nfn main() {\n    let txns = vec![\n        Transaction { category: \"food\".into(), amount: 12.50 },\n        Transaction { category: \"transport\".into(), amount: 5.00 },\n        Transaction { category: \"food\".into(), amount: 8.75 },\n        Transaction { category: \"books\".into(), amount: 24.00 },\n    ];\n\n    let totals = group_by_category(&txns);\n    for (cat, amt) in &totals {\n        println!(\"{cat}: {amt:.2}\");\n    }\n}" },
      {
        t: 'try',
        prompt: "Write find_duplicates(words: &[&str]) -> Vec<&str> that returns all words that appear more than once, in the order they first appear.\n\nfind_duplicates(&[\"a\", \"b\", \"a\", \"c\", \"b\"]) -> [\"a\", \"b\"]\n\nUse a HashMap<&str, usize> to count, then filter.",
        lang: 'rust',
        starter: "use std::collections::HashMap;\n\nfn find_duplicates(words: &[&str]) -> Vec<&str> {\n    todo!()\n}\n",
        solution: "use std::collections::HashMap;\n\nfn find_duplicates(words: &[&str]) -> Vec<&str> {\n    let mut counts: HashMap<&str, usize> = HashMap::new();\n    for w in words {\n        *counts.entry(w).or_insert(0) += 1;\n    }\n    let mut seen = Vec::new();\n    for w in words {\n        if counts[w] > 1 && !seen.contains(w) {\n            seen.push(*w);\n        }\n    }\n    seen\n}\n",
        hints: ['First pass: count with counts.entry(w).or_insert(0).', 'Second pass: push words where count > 1 and not already in result.', 'Use !seen.contains(w) to preserve first-appearance order.'],
        cases: [
          { name: 'has duplicates', call: 'find_duplicates(&["a", "b", "a", "c", "b"])', expect: 'vec!["a", "b"]' },
          { name: 'no duplicates', call: 'find_duplicates(&["x", "y", "z"])', expect: 'Vec::<&str>::new()' },
        ],
      },
      { t: 'quiz', q: 'What does `*counts.entry(word).or_insert(0) += 1;` do?', options: ['Inserts the word with value 1 every time', 'Looks up the word, inserts 0 if missing, then increments the value by 1 \u2014 all in one lookup', 'Deletes the entry', 'It is a syntax error'], answer: 1, why: 'entry() returns an Entry enum. or_insert(0) gives &mut V, inserting 0 if the key is absent. The * dereferences and += 1 mutates. One hash lookup total.' },
      {
        t: 'try',
        prompt: "Write merge_maps(a: &HashMap<String, i32>, b: &HashMap<String, i32>) -> HashMap<String, i32> that combines two maps \u2014 keys in both maps have their values summed.\n\nClone a, then iterate b and add to matching keys.",
        lang: 'rust',
        starter: "use std::collections::HashMap;\n\nfn merge_maps(a: &HashMap<String, i32>, b: &HashMap<String, i32>) -> HashMap<String, i32> {\n    todo!()\n}\n",
        solution: "use std::collections::HashMap;\n\nfn merge_maps(a: &HashMap<String, i32>, b: &HashMap<String, i32>) -> HashMap<String, i32> {\n    let mut result = a.clone();\n    for (k, v) in b {\n        *result.entry(k.clone()).or_insert(0) += v;\n    }\n    result\n}\n",
        hints: ['Start with let mut result = a.clone();', 'Loop with for (k, v) in b { *result.entry(k.clone()).or_insert(0) += v; }', 'Return result.'],
        cases: [
          { name: 'overlap', call: 'merge_maps(&HashMap::from([("x".into(), 2)]), &HashMap::from([("x".into(), 3), ("y".into(), 1)]))', expect: 'HashMap::from([("x".into(), 5), ("y".into(), 1)])' },
          { name: 'disjoint', call: 'merge_maps(&HashMap::from([("a".into(), 1)]), &HashMap::from([("b".into(), 2)]))', expect: 'HashMap::from([("a".into(), 1), ("b".into(), 2)])' },
        ],
      },
    ],
  },

  /* ==================================================== 15 */
  {
    id: 'rs-l15',
    topic: 'concurrency',
    difficulty: 'intermediate',
    title: 'Fearless Concurrency',
    minutes: 15,
    summary: 'Threads, message passing with channels, and shared state with Arc and Mutex \u2014 the three pillars of Rust concurrency.',
    objectives: ['Spawn threads with std::thread::spawn', 'Send data between threads with mpsc::channel', 'Share mutable state safely with Arc<Mutex<T>>'],
    blocks: [
      { t: 'text', md: "Rust's type system makes concurrency **fearless** \u2014 not because bugs are impossible, but because the compiler catches data races at compile time.\n\nThree patterns cover most concurrent Rust:\n\n1. **Message passing** \u2014 threads communicate by sending values through channels (mpsc::channel)\n2. **Shared state** \u2014 Arc<Mutex<T>> for reference-counted, lock-protected data\n3. **Scoped threads** \u2014 borrow data from the parent scope safely with thread::scope" },
      { t: 'code', run: true, lang: 'rust', code: "use std::thread;\nuse std::time::Duration;\n\nfn main() {\n    let handle = thread::spawn(|| {\n        for i in 1..=5 {\n            println!(\"worker: {i}\");\n            thread::sleep(Duration::from_millis(50));\n        }\n    });\n\n    for i in 1..=3 {\n        println!(\"main: {i}\");\n        thread::sleep(Duration::from_millis(50));\n    }\n\n    handle.join().unwrap();\n    println!(\"both done\");\n}" },
      { t: 'text', md: '## Channels: "Do not communicate by sharing memory; share memory by communicating."\n\n`mpsc::channel()` returns a `(tx, rx)` pair \u2014 a transmitter and a receiver. Multiple transmitters can clone the sender; one receiver collects. When all senders are dropped, the channel closes.' },
      { t: 'code', run: true, lang: 'rust', code: "use std::thread;\nuse std::sync::mpsc;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    for id in 0..3 {\n        let tx = tx.clone();\n        thread::spawn(move || {\n            tx.send(format!(\"thread {id} done\")).unwrap();\n        });\n    }\n    drop(tx);\n\n    for msg in rx {\n        println!(\"received: {msg}\");\n    }\n}" },
      {
        t: 'case',
        title: 'Case study \u2014 a parallel sum with message passing',
        md: 'Split a large slice into chunks, sum each chunk in a separate thread, and collect the results via a channel. The key insight: the threads own their chunks (via to_vec()), so there is no shared data and no locking.',
        run: true,
        lang: 'rust',
        code: "use std::thread;\nuse std::sync::mpsc;\n\nfn parallel_sum(data: &[i64], num_threads: usize) -> i64 {\n    let chunk_size = (data.len() + num_threads - 1) / num_threads;\n    let (tx, rx) = mpsc::channel();\n\n    for chunk in data.chunks(chunk_size) {\n        let tx = tx.clone();\n        let owned = chunk.to_vec();\n        thread::spawn(move || {\n            let sum: i64 = owned.iter().sum();\n            tx.send(sum).unwrap();\n        });\n    }\n    drop(tx);\n\n    rx.iter().sum()\n}\n\nfn main() {\n    let data: Vec<i64> = (1..=1000).collect();\n    let total = parallel_sum(&data, 4);\n    println!(\"sum: {total} (expected 500500)\");\n}" },
      { t: 'text', md: '## Shared state with Arc<Mutex<T>>\n\nWhen threads need to read AND write the same data, wrap it in Arc<Mutex<T>>. Arc gives shared ownership across threads (the thread-safe version of Rc). Mutex provides interior mutability with locking \u2014 only one thread accesses the data at a time.' },
      { t: 'code', run: true, lang: 'rust', code: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n\n    for _ in 0..10 {\n        let counter = Arc::clone(&counter);\n        let handle = thread::spawn(move || {\n            let mut num = counter.lock().unwrap();\n            *num += 1;\n        });\n        handles.push(handle);\n    }\n\n    for handle in handles {\n        handle.join().unwrap();\n    }\n\n    println!(\"counter: {} (expected 10)\", *counter.lock().unwrap());\n}" },
      {
        t: 'try',
        prompt: "Write spawn_and_collect<F, T>(work: F) -> T where F: FnOnce() -> T + Send + 'static, T: Send + 'static.\n\nSpawn work in a new thread and return its result by joining. The trait bounds are given \u2014 you only need the body.",
        lang: 'rust',
        starter: "use std::thread;\n\nfn spawn_and_collect<F, T>(work: F) -> T\nwhere\n    F: FnOnce() -> T + Send + 'static,\n    T: Send + 'static,\n{\n    todo!()\n}\n",
        solution: "use std::thread;\n\nfn spawn_and_collect<F, T>(work: F) -> T\nwhere\n    F: FnOnce() -> T + Send + 'static,\n    T: Send + 'static,\n{\n    thread::spawn(work).join().unwrap()\n}\n",
        hints: ['thread::spawn(work) runs work in a new thread.', '.join() waits for the thread and returns a Result.', '.unwrap() extracts the value (or panics if the thread panicked).'],
        cases: [
          { name: 'computes in thread', call: 'spawn_and_collect(|| 42)', expect: '42' },
          { name: 'string concat', call: 'spawn_and_collect(|| String::from("hello ") + "world")', expect: 'String::from("hello world")' },
        ],
      },
      { t: 'quiz', q: "Why does thread::spawn require Send + 'static on the closure?", options: ['It does not \u2014 these are optional', "Send because the closure moves to another thread; 'static because the spawned thread could outlive the scope that created it", 'For performance reasons', 'Only for debugging'], answer: 1, why: "The spawned thread runs independently \u2014 it might outlive the spawning scope. Any references in the closure would be invalid after the parent returns unless they are 'static. Send is required because the closure crosses a thread boundary." },
      {
        t: 'try',
        prompt: 'Write counter_increment(counter: Arc<Mutex<i32>>) -> i32 that locks the counter, increments it by 1, and returns the new value.\n\nUse counter.lock().unwrap() to get the guard, dereference with * to mutate, then return.',
        lang: 'rust',
        starter: "use std::sync::{Arc, Mutex};\n\nfn counter_increment(counter: Arc<Mutex<i32>>) -> i32 {\n    todo!()\n}\n",
        solution: "use std::sync::{Arc, Mutex};\n\nfn counter_increment(counter: Arc<Mutex<i32>>) -> i32 {\n    let mut guard = counter.lock().unwrap();\n    *guard += 1;\n    *guard\n}\n",
        hints: ['let mut guard = counter.lock().unwrap(); gives a MutexGuard.', '*guard += 1; increments.', 'Return *guard \u2014 the new value.'],
        cases: [
          { name: 'from zero', call: 'counter_increment(Arc::new(Mutex::new(0)))', expect: '1' },
          { name: 'from five', call: 'counter_increment(Arc::new(Mutex::new(5)))', expect: '6' },
        ],
      },
    ],
  },

  /* ==================================================== 16 */
  {
    id: 'rs-l16',
    topic: 'concurrency',
    difficulty: 'advanced',
    title: 'Async Rust and Futures',
    minutes: 15,
    summary: 'The async/await model, Futures, and how Rust achieves zero-cost asynchronous programming without a runtime built into the language.',
    objectives: ['Write an async function with async/await syntax', 'Understand that async fn returns a Future, not a value', 'Use tokio::join! to run futures concurrently'],
    blocks: [
      { t: 'text', md: "Rust's async story is different from most languages. There is **no built-in runtime** — `async` and `await` are language keywords that produce state machines, but you bring your own executor (Tokio, async-std, smol).\n\n```rust\nasync fn fetch_data() -> String {\n    // This compiles but does nothing until .await-ed on a runtime\n    \"data\".to_string()\n}\n```\n\nAn `async fn` returns a `Future` — a value that represents work **not yet done**. Nothing happens until the future is polled by an executor. This is why you need a runtime like Tokio to actually run async code." },
      { t: 'code', run: true, lang: 'rust', code: "// Async functions return Futures, not values.\n// They must be .await-ed inside another async context.\n\nasync fn double(x: i32) -> i32 {\n    x * 2\n}\n\nasync fn compute() -> i32 {\n    let a = double(10).await;\n    let b = double(20).await;\n    a + b  // 20 + 40 = 60\n}\n\n// Without a runtime, we demonstrate the idea with a sync wrapper.\n// In real code, you'd use #[tokio::main] or similar.\nfn main() {\n    // This only works for illustration — a real async program needs an executor.\n    // The concept: Futures compose, .await yields control, and the executor orchestrates.\n    println!(\"Async functions produce Futures. An executor polls them to completion.\");\n}" },
      { t: 'text', md: "## Concurrent execution with join!\n\n`.await` runs futures **sequentially** — each one completes before the next starts. To run futures **concurrently**, use `tokio::join!` (or `futures::join!`):\n\n```rust\ntokio::join!(future_a, future_b, future_c);\n```\n\nAll three start together. `join!` returns when all are done. This is the async equivalent of spawning threads — but without the overhead of OS threads." },
      {
        t: 'case',
        title: 'Case study \u2014 concurrent HTTP requests',
        md: "Fetching three URLs sequentially takes N*latency. Fetching them concurrently with join! takes max(latency). This is the core value proposition of async — doing other work while waiting for I/O. The syntax mirrors sequential code but the runtime interleaves execution.",
        run: true,
        lang: 'rust',
        code: "use std::time::{Duration, Instant};\n\n// Simulated async I/O — in real code this would be reqwest::get()\nasync fn fetch(id: u32, delay_ms: u64) -> String {\n    // std::thread::sleep is blocking — this is just for illustration.\n    // Real async code would use tokio::time::sleep.\n    format!(\"result from {id}\")\n}\n\n// Pattern: define work as Futures, join them for concurrency\nfn main() {\n    let start = Instant::now();\n\n    // In real async code with tokio:\n    // let (r1, r2, r3) = tokio::join!(fetch(1), fetch(2), fetch(3));\n\n    println!(\"Three futures, one join! call — all run concurrently\");\n    println!(\"Elapsed: {:?}\", start.elapsed());\n}" },
      { t: 'text', md: "## The async ecosystem\n\n| Crate | Purpose |\n|---|---|\n| `tokio` | The dominant async runtime — executor, I/O, timers, channels |\n| `async-std` | stdlib-like API, lighter weight |\n| `futures` | Combinators and utilities (join!, select!, Stream) |\n| `reqwest` | Async HTTP client built on tokio |\n| `sqlx` | Async SQL database driver |\n\nMost production Rust async code uses Tokio. Add it to Cargo.toml with `cargo add tokio --features full`." },
      {
        t: 'try',
        prompt: "Write an async function add_async(a: i32, b: i32) -> i32 that returns the sum. Then write an async function compute_sum() -> i32 that calls add_async(5, 10).await and add_async(15, 20).await, then returns the total (5+10+15+20 = 50).\n\nNote: in the harness these are called synchronously — focus on writing correct async/await syntax.",
        lang: 'rust',
        starter: "async fn add_async(a: i32, b: i32) -> i32 {\n    todo!()\n}\n\nasync fn compute_sum() -> i32 {\n    todo!()\n}\n",
        solution: "async fn add_async(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nasync fn compute_sum() -> i32 {\n    let x = add_async(5, 10).await;\n    let y = add_async(15, 20).await;\n    x + y\n}\n",
        hints: ['async fn returns impl Future — write the body as normal code.', '.await yields control until the future completes.', 'compute_sum: await each call, add the results.'],
        cases: [
          { name: 'add async', call: 'add_async(3, 4)', expect: '7' },
          { name: 'compute sum', call: 'compute_sum()', expect: '50' },
        ],
      },
      { t: 'quiz', q: 'Why does Rust need an external runtime for async (like Tokio) when languages like JavaScript and Python have built-in event loops?', options: ['Rust is incomplete', 'Rust has no built-in runtime by design — this keeps the language small, lets you choose the executor, and allows async in embedded/no_std contexts where an event loop would be wasteful', 'Tokio is built into Rust but hidden', 'Async Rust is experimental'], answer: 1, why: "Rust targets everything from microcontrollers to servers. Baking in an event loop would make it unsuitable for environments that don't want one. Instead, async is a language feature that compiles to efficient state machines, and you pick the executor (or none) that fits." },
      {
        t: 'try',
        prompt: "Write compute_all() that demonstrates the concurrent pattern. It should call add_async(1, 2), add_async(3, 4), and add_async(5, 6) — each returning 3, 7, and 11 respectively. Then return their sum (21).\n\nCall them sequentially with .await — the point is writing the pattern, even though these particular futures are not I/O-bound.",
        lang: 'rust',
        starter: "async fn compute_all() -> i32 {\n    todo!()\n}\n",
        solution: "async fn compute_all() -> i32 {\n    let a = add_async(1, 2).await;\n    let b = add_async(3, 4).await;\n    let c = add_async(5, 6).await;\n    a + b + c\n}\n",
        hints: ['Await each call and add the results.', 'No special syntax needed — just .await each one.', 'Return the sum.'],
        cases: [
          { name: 'compute all', call: 'compute_all()', expect: '21' },
        ],
      },
    ],
  },
];
