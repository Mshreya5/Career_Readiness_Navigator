const QUESTION_BANK = {
  JavaScript: [
    {
      id: 'js_1',
      skill: 'JavaScript',
      topic: 'Variables & Scope',
      difficulty: 'Easy',
      question: 'What will the following JavaScript code print to the console?',
      codeSnippet: 'let x = 10;\nconsole.log(typeof x);',
      options: ['number', 'integer', 'float', 'string'],
      correctAnswer: 'number',
      explanation: 'In JavaScript, all numbers (integers and floating-point values) have the type "number".'
    },
    {
      id: 'js_2',
      skill: 'JavaScript',
      topic: 'Arrays',
      difficulty: 'Medium',
      question: 'Which array method creates a new array populated with the results of calling a provided function on every element?',
      codeSnippet: '',
      options: ['forEach()', 'map()', 'filter()', 'reduce()'],
      correctAnswer: 'map()',
      explanation: 'Array.prototype.map() returns a brand new array with transformed elements without mutating the original array.'
    },
    {
      id: 'js_3',
      skill: 'JavaScript',
      topic: 'Asynchronous JS',
      difficulty: 'Medium',
      question: 'What will be logged to the console first when this code executes?',
      codeSnippet: 'console.log("Start");\nsetTimeout(() => console.log("Timeout"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("End");',
      options: ['Start', 'Timeout', 'Promise', 'End'],
      correctAnswer: 'Start',
      explanation: 'Synchronous execution runs first, logging "Start" then "End". Promises (microtasks) run before setTimeout (macrotasks).'
    },
    {
      id: 'js_4',
      skill: 'JavaScript',
      topic: 'Equality',
      difficulty: 'Easy',
      question: 'What is the result of evaluating 0 == "0" and 0 === "0" in JavaScript?',
      codeSnippet: 'console.log(0 == "0", 0 === "0");',
      options: ['true, false', 'true, true', 'false, false', 'false, true'],
      correctAnswer: 'true, false',
      explanation: '== performs type coercion (converting "0" to 0), whereas === checks strict equality without type coercion.'
    },
    {
      id: 'js_5',
      skill: 'JavaScript',
      topic: 'Objects & Closures',
      difficulty: 'Hard',
      question: 'What value is logged by calling createCounter()() twice?',
      codeSnippet: 'function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c = createCounter();\nconsole.log(c(), c());',
      options: ['1 2', '1 1', '0 1', '2 2'],
      correctAnswer: '1 2',
      explanation: 'The returned inner function maintains access to count via closure, incrementing and returning 1 then 2.'
    }
  ],

  Python: [
    {
      id: 'py_1',
      skill: 'Python',
      topic: 'Data Types',
      difficulty: 'Easy',
      question: 'What is the output of the following Python code?',
      codeSnippet: 'nums = [1, 2, 3]\nprint(nums * 2)',
      options: ['[1, 2, 3, 1, 2, 3]', '[2, 4, 6]', '[1, 2, 3, 2]', 'TypeError'],
      correctAnswer: '[1, 2, 3, 1, 2, 3]',
      explanation: 'Multiplying a list by an integer in Python repeats the elements of the list.'
    },
    {
      id: 'py_2',
      skill: 'Python',
      topic: 'Dictionaries',
      difficulty: 'Medium',
      question: 'Which method safely retrieves a value from a dictionary with an optional default if the key is missing?',
      codeSnippet: '',
      options: ['dict.get(key, default)', 'dict.fetch(key)', 'dict.lookup(key)', 'dict.find(key)'],
      correctAnswer: 'dict.get(key, default)',
      explanation: '.get() returns None or the specified default value instead of raising a KeyError if the key does not exist.'
    },
    {
      id: 'py_3',
      skill: 'Python',
      topic: 'List Comprehensions',
      difficulty: 'Medium',
      question: 'What does the following comprehension produce?',
      codeSnippet: '[x**2 for x in range(5) if x % 2 == 0]',
      options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[0, 2, 4]'],
      correctAnswer: '[0, 4, 16]',
      explanation: 'range(5) gives 0,1,2,3,4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.'
    },
    {
      id: 'py_4',
      skill: 'Python',
      topic: 'Mutability',
      difficulty: 'Hard',
      question: 'What happens when passing a mutable object (like a list) as a default parameter in a function definition?',
      codeSnippet: 'def add_item(item, lst=[]):\n  lst.append(item)\n  return lst',
      options: [
        'The list is shared across all function calls that use the default',
        'A fresh new list is created every time the function runs',
        'Python raises a SyntaxError',
        'The list is automatically converted to a tuple'
      ],
      correctAnswer: 'The list is shared across all function calls that use the default',
      explanation: 'Default argument values are evaluated once when the function definition is executed, making mutable defaults persistent.'
    },
    {
      id: 'py_5',
      skill: 'Python',
      topic: 'Functions',
      difficulty: 'Easy',
      question: 'Which keyword is used to return values from a function in Python?',
      codeSnippet: '',
      options: ['return', 'yield', 'emit', 'output'],
      correctAnswer: 'return',
      explanation: 'The return keyword exits a function and optionally passes back an expression to the caller.'
    }
  ],

  Java: [
    {
      id: 'java_1',
      skill: 'Java',
      topic: 'OOP Concepts',
      difficulty: 'Easy',
      question: 'Which of the following is NOT a core principle of Object-Oriented Programming in Java?',
      codeSnippet: '',
      options: ['Compilation', 'Encapsulation', 'Inheritance', 'Polymorphism'],
      correctAnswer: 'Compilation',
      explanation: 'Encapsulation, Inheritance, Polymorphism, and Abstraction are the four OOP pillars. Compilation is a build step.'
    },
    {
      id: 'java_2',
      skill: 'Java',
      topic: 'Strings & Memory',
      difficulty: 'Medium',
      question: 'What is the difference between String s1 = "hello" and String s2 = new String("hello")?',
      codeSnippet: '',
      options: [
        's1 is stored in the String Constant Pool; s2 forces a new Object on the Heap',
        's1 is mutable; s2 is immutable',
        's1 cannot be compared using .equals()',
        's2 is automatically garbage collected immediately'
      ],
      correctAnswer: 's1 is stored in the String Constant Pool; s2 forces a new Object on the Heap',
      explanation: 'String literals use the String Constant Pool for memory reuse, while new String() explicitly allocates a new Heap object.'
    },
    {
      id: 'java_3',
      skill: 'Java',
      topic: 'Collections',
      difficulty: 'Medium',
      question: 'Which List implementation provides O(1) random access by index?',
      codeSnippet: '',
      options: ['ArrayList', 'LinkedList', 'Vector', 'Stack'],
      correctAnswer: 'ArrayList',
      explanation: 'ArrayList is backed by an indexed array, allowing fast O(1) random access compared to LinkedList O(n).'
    },
    {
      id: 'java_4',
      skill: 'Java',
      topic: 'Exception Handling',
      difficulty: 'Hard',
      question: 'Will the code inside a finally block execute if a return statement is encountered in the try block?',
      codeSnippet: '',
      options: ['Yes, always', 'No, return exits immediately', 'Only if an exception occurred', 'Only in Java 17+'],
      correctAnswer: 'Yes, always',
      explanation: 'The finally block always executes before returning from a method, unless System.exit() or JVM crash occurs.'
    },
    {
      id: 'java_5',
      skill: 'Java',
      topic: 'Keywords',
      difficulty: 'Easy',
      question: 'Which modifier prevents a variable from being modified after initialization?',
      codeSnippet: '',
      options: ['final', 'static', 'const', 'sealed'],
      correctAnswer: 'final',
      explanation: 'Declaring a variable as final means its value cannot be reassigned once initialized.'
    }
  ],

  'C++': [
    {
      id: 'cpp_1',
      skill: 'C++',
      topic: 'Pointers',
      difficulty: 'Easy',
      question: 'What operator is used to dereference a pointer in C++?',
      codeSnippet: 'int a = 10; int* p = &a;',
      options: ['*', '&', '->', '.'],
      correctAnswer: '*',
      explanation: 'The * operator dereferences a pointer to access the value stored at the memory address.'
    },
    {
      id: 'cpp_2',
      skill: 'C++',
      topic: 'Memory Management',
      difficulty: 'Medium',
      question: 'Which operator must be used to free memory allocated with new int[50]?',
      codeSnippet: '',
      options: ['delete[]', 'delete', 'free()', 'release()'],
      correctAnswer: 'delete[]',
      explanation: 'Arrays allocated with new[] must be deallocated using delete[] to invoke destructors for all elements.'
    },
    {
      id: 'cpp_3',
      skill: 'C++',
      topic: 'STL Containers',
      difficulty: 'Medium',
      question: 'What is the average time complexity for searching an element in std::unordered_map?',
      codeSnippet: '',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctAnswer: 'O(1)',
      explanation: 'std::unordered_map uses a hash table providing O(1) average time complexity for lookups.'
    },
    {
      id: 'cpp_4',
      skill: 'C++',
      topic: 'Smart Pointers',
      difficulty: 'Hard',
      question: 'Which C++11 smart pointer represents exclusive ownership of a dynamically allocated object?',
      codeSnippet: '',
      options: ['std::unique_ptr', 'std::shared_ptr', 'std::weak_ptr', 'std::auto_ptr'],
      correctAnswer: 'std::unique_ptr',
      explanation: 'std::unique_ptr owns and manages another object through a pointer and disallows copying (move-only).'
    },
    {
      id: 'cpp_5',
      skill: 'C++',
      topic: 'References',
      difficulty: 'Easy',
      question: 'Can a reference in C++ be reassigned to refer to another variable after initialization?',
      codeSnippet: '',
      options: ['No', 'Yes', 'Only inside class constructors', 'Only if marked mutable'],
      correctAnswer: 'No',
      explanation: 'A reference is an alias for an existing object and cannot be rebound to a different object after creation.'
    }
  ],

  SQL: [
    {
      id: 'sql_1',
      skill: 'SQL',
      topic: 'Filtering & Aggregation',
      difficulty: 'Easy',
      question: 'Which clause is used to filter group results after a GROUP BY in SQL?',
      codeSnippet: '',
      options: ['HAVING', 'WHERE', 'ORDER BY', 'FILTER'],
      correctAnswer: 'HAVING',
      explanation: 'HAVING filters aggregate results produced by GROUP BY, while WHERE filters rows before aggregation.'
    },
    {
      id: 'sql_2',
      skill: 'SQL',
      topic: 'Joins',
      difficulty: 'Medium',
      question: 'Which type of JOIN returns all rows from the left table, even if there are no matches in the right table?',
      codeSnippet: '',
      options: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
      correctAnswer: 'LEFT JOIN',
      explanation: 'LEFT JOIN (or LEFT OUTER JOIN) preserves all records from the left table and fills non-matching right columns with NULL.'
    },
    {
      id: 'sql_3',
      skill: 'SQL',
      topic: 'Uniqueness',
      difficulty: 'Easy',
      question: 'Which SQL keyword removes duplicate rows from the query result set?',
      codeSnippet: '',
      options: ['DISTINCT', 'UNIQUE', 'GROUP', 'DEDUPE'],
      correctAnswer: 'DISTINCT',
      explanation: 'SELECT DISTINCT eliminates duplicate rows from the result set.'
    },
    {
      id: 'sql_4',
      skill: 'SQL',
      topic: 'Subqueries',
      difficulty: 'Medium',
      question: 'What does the EXISTS operator test for in a subquery?',
      codeSnippet: '',
      options: ['Whether the subquery returns at least one row', 'Whether all rows match', 'Whether the table is empty', 'Whether columns match'],
      correctAnswer: 'Whether the subquery returns at least one row',
      explanation: 'EXISTS returns true if the subquery returns one or more rows.'
    },
    {
      id: 'sql_5',
      skill: 'SQL',
      topic: 'Indexing',
      difficulty: 'Hard',
      question: 'What primary benefit does creating a database index on a column provide?',
      codeSnippet: '',
      options: [
        'Faster SELECT query performance at the cost of slightly slower writes',
        'Automatic encryption of sensitive column values',
        'Prevention of NULL values in that column',
        'Automatic database backup creation'
      ],
      correctAnswer: 'Faster SELECT query performance at the cost of slightly slower writes',
      explanation: 'Indexes create data structures (like B-Trees) allowing rapid data retrieval without scanning the entire table.'
    }
  ],

  HTML: [
    {
      id: 'html_1',
      skill: 'HTML',
      topic: 'Semantic HTML',
      difficulty: 'Easy',
      question: 'Which element should be used to wrap the main navigational links of a webpage?',
      codeSnippet: '',
      options: ['<nav>', '<menu>', '<header>', '<aside>'],
      correctAnswer: '<nav>',
      explanation: 'The <nav> semantic HTML element is intended for major navigation blocks.'
    },
    {
      id: 'html_2',
      skill: 'HTML',
      topic: 'Forms & Accessibility',
      difficulty: 'Medium',
      question: 'What attribute binds an HTML <label> element directly to its corresponding <input>?',
      codeSnippet: '',
      options: ['for', 'id', 'name', 'target'],
      correctAnswer: 'for',
      explanation: 'The "for" attribute on <label> matches the "id" attribute of the target <input>.'
    },
    {
      id: 'html_3',
      skill: 'HTML',
      topic: 'Attributes',
      difficulty: 'Easy',
      question: 'Which attribute provides accessible text alternative for an <img> element if the image fails to load?',
      codeSnippet: '',
      options: ['alt', 'title', 'src', 'caption'],
      correctAnswer: 'alt',
      explanation: 'The alt attribute specifies alternative text for screen readers and broken image fallbacks.'
    },
    {
      id: 'html_4',
      skill: 'HTML',
      topic: 'SEO & Head',
      difficulty: 'Medium',
      question: 'Where should <meta name="description"> tags be placed in an HTML document?',
      codeSnippet: '',
      options: ['Inside the <head> element', 'Inside the <body> element', 'Inside the <footer> element', 'At the very end of the file'],
      correctAnswer: 'Inside the <head> element',
      explanation: 'All metadata, scripts, stylesheets, and titles belong inside the <head> element.'
    },
    {
      id: 'html_5',
      skill: 'HTML',
      topic: 'Document Structure',
      difficulty: 'Easy',
      question: 'What is the required declaration at the very top of an HTML5 document?',
      codeSnippet: '',
      options: ['<!DOCTYPE html>', '<html version="5">', '<?xml version="1.0"?>', '<DOCTYPE ROOT>'],
      correctAnswer: '<!DOCTYPE html>',
      explanation: '<!DOCTYPE html> instructs web browsers to render the page in standards mode according to HTML5.'
    }
  ],

  CSS: [
    {
      id: 'css_1',
      skill: 'CSS',
      topic: 'Box Model',
      difficulty: 'Easy',
      question: 'Which box-sizing property value ensures that padding and border are included in the element’s total width and height?',
      codeSnippet: '',
      options: ['border-box', 'content-box', 'padding-box', 'flex-box'],
      correctAnswer: 'border-box',
      explanation: 'box-sizing: border-box tells the browser to account for padding and border in the element\'s defined width/height.'
    },
    {
      id: 'css_2',
      skill: 'CSS',
      topic: 'Flexbox',
      difficulty: 'Medium',
      question: 'Which property aligns flex items along the main axis of a flex container?',
      codeSnippet: '',
      options: ['justify-content', 'align-items', 'align-content', 'flex-direction'],
      correctAnswer: 'justify-content',
      explanation: 'justify-content aligns items along the main axis (horizontal by default), while align-items controls cross axis.'
    },
    {
      id: 'css_3',
      skill: 'CSS',
      topic: 'Specificity',
      difficulty: 'Hard',
      question: 'Which CSS selector has the highest specificity score?',
      codeSnippet: '',
      options: ['#header .menu span', '.nav-bar .menu-item', 'header nav span', 'div p.description'],
      correctAnswer: '#header .menu span',
      explanation: 'ID selectors (#header) carry higher specificity (1-1-1) than class selectors (.menu) or element selectors.'
    },
    {
      id: 'css_4',
      skill: 'CSS',
      topic: 'Layout',
      difficulty: 'Medium',
      question: 'What happens when an element has position: absolute?',
      codeSnippet: '',
      options: [
        'It is removed from normal document flow and positioned relative to its nearest positioned ancestor',
        'It stays in normal document flow and shifts relative to its current position',
        'It is anchored strictly to the viewport regardless of scrolling',
        'It cannot overlap with other elements'
      ],
      correctAnswer: 'It is removed from normal document flow and positioned relative to its nearest positioned ancestor',
      explanation: 'position: absolute takes an element out of standard flow and places it relative to its nearest non-static ancestor.'
    },
    {
      id: 'css_5',
      skill: 'CSS',
      topic: 'Grid',
      difficulty: 'Medium',
      question: 'Which CSS Grid property defines columns with flexible fractional sizing?',
      codeSnippet: 'grid-template-columns: 1fr 2fr;',
      options: ['1fr 2fr', '1px 2px', '10% 20%', 'auto 200px'],
      correctAnswer: '1fr 2fr',
      explanation: 'The fr unit represents a fraction of the available free space in the grid container.'
    }
  ],

  React: [
    {
      id: 'react_1',
      skill: 'React',
      topic: 'Hooks',
      difficulty: 'Easy',
      question: 'Which hook should be used to perform side effects (such as fetching data or subscribing to events) in functional components?',
      codeSnippet: '',
      options: ['useEffect', 'useState', 'useContext', 'useMemo'],
      correctAnswer: 'useEffect',
      explanation: 'useEffect serves the purpose of lifecycle side effects in React function components.'
    },
    {
      id: 'react_2',
      skill: 'React',
      topic: 'State & Rendering',
      difficulty: 'Medium',
      question: 'What happens when you update state directly without using the setter function from useState?',
      codeSnippet: 'const [items, setItems] = useState([]);\nitems.push("new"); // Direct mutation',
      options: [
        'React will not re-render the component to reflect the change',
        'React will throw a runtime TypeError',
        'The change is automatically saved to localStorage',
        'The component re-renders twice'
      ],
      correctAnswer: 'React will not re-render the component to reflect the change',
      explanation: 'Direct state mutation bypasses React\'s state change notifications, preventing automatic component re-renders.'
    },
    {
      id: 'react_3',
      skill: 'React',
      topic: 'JSX & Keys',
      difficulty: 'Medium',
      question: 'Why does React require a unique "key" prop when rendering lists of elements?',
      codeSnippet: '',
      options: [
        'To help React identify which items have changed, been added, or removed for efficient diffing',
        'To apply CSS styling to list items automatically',
        'To make array methods like .map() work faster',
        'To secure data against cross-site scripting'
      ],
      correctAnswer: 'To help React identify which items have changed, been added, or removed for efficient diffing',
      explanation: 'Keys allow React\'s virtual DOM algorithm to reconcile list changes efficiently without recreating DOM nodes unnecessarily.'
    },
    {
      id: 'react_4',
      skill: 'React',
      topic: 'Props',
      difficulty: 'Easy',
      question: 'Are React props mutable or read-only inside the child component receiving them?',
      codeSnippet: '',
      options: ['Read-only (immutable)', 'Mutable', 'Mutable only inside useEffect', 'Mutable if defined as let'],
      correctAnswer: 'Read-only (immutable)',
      explanation: 'Props are strictly read-only inputs passed from parent to child components.'
    },
    {
      id: 'react_5',
      skill: 'React',
      topic: 'Performance Optimization',
      difficulty: 'Hard',
      question: 'Which hook memoizes a callback function to prevent unnecessary child re-renders when passed as a prop?',
      codeSnippet: '',
      options: ['useCallback', 'useMemo', 'useRef', 'useReducer'],
      correctAnswer: 'useCallback',
      explanation: 'useCallback returns a memoized version of the callback function that only changes if dependency values change.'
    }
  ],

  'Node.js': [
    {
      id: 'node_1',
      skill: 'Node.js',
      topic: 'Event Loop',
      difficulty: 'Medium',
      question: 'What architectural model allows Node.js to handle thousands of concurrent requests efficiently on a single thread?',
      codeSnippet: '',
      options: [
        'Single-threaded event loop with non-blocking I/O',
        'Multi-threaded thread pool per request',
        'Synchronous blocking process management',
        'Static file compilation'
      ],
      correctAnswer: 'Single-threaded event loop with non-blocking I/O',
      explanation: 'Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.'
    },
    {
      id: 'node_2',
      skill: 'Node.js',
      topic: 'Core Modules',
      difficulty: 'Easy',
      question: 'Which built-in Node.js module provides utilities for working with file and directory paths?',
      codeSnippet: '',
      options: ['path', 'fs', 'http', 'os'],
      correctAnswer: 'path',
      explanation: 'The path module provides helpful utilities for handling cross-platform file paths.'
    },
    {
      id: 'node_3',
      skill: 'Node.js',
      topic: 'Express Middleware',
      difficulty: 'Medium',
      question: 'In Express.js middleware functions, what happens if you forget to call next() or send a response?',
      codeSnippet: 'app.use((req, res, next) => {\n  console.log("Processing...");\n  // Forgot next()\n});',
      options: [
        'The request will hang indefinitely and client will timeout',
        'Express will automatically proceed to the next route handler',
        'Node.js process will immediately crash',
        'Response status 200 OK is returned automatically'
      ],
      correctAnswer: 'The request will hang indefinitely and client will timeout',
      explanation: 'Middleware functions must explicitly either end the request-response cycle or call next() to pass control.'
    },
    {
      id: 'node_4',
      skill: 'Node.js',
      topic: 'NPM & Modules',
      difficulty: 'Easy',
      question: 'What is the purpose of the package.json file in a Node.js project?',
      codeSnippet: '',
      options: [
        'Holds project metadata, script commands, and lists project dependencies',
        'Stores database credentials securely',
        'Compiles JavaScript code into native machine code',
        'Generates HTML pages on demand'
      ],
      correctAnswer: 'Holds project metadata, script commands, and lists project dependencies',
      explanation: 'package.json serves as the manifest for Node.js projects specifying dependencies, scripts, and configuration.'
    },
    {
      id: 'node_5',
      skill: 'Node.js',
      topic: 'Streams',
      difficulty: 'Hard',
      question: 'Which stream method connects a readable stream directly to a writable stream for efficient data transfer?',
      codeSnippet: 'readableStream.____(writableStream);',
      options: ['pipe()', 'transfer()', 'send()', 'connect()'],
      correctAnswer: 'pipe()',
      explanation: 'pipe() attaches a Writable stream to a Readable stream, managing backpressure automatically.'
    }
  ]
}

const CODING_PROBLEMS = {
  JavaScript: [
    {
      id: 'code_js_1',
      skill: 'JavaScript',
      title: 'Find Maximum Element in Array',
      description: 'Write a function `findMax(arr)` that takes an array of numbers and returns the largest number in the array.',
      inputDescription: 'An array of numbers `arr`, e.g., `[3, 7, 2, 9, 4]`.',
      outputDescription: 'Returns a single number representing the maximum value.',
      starterCode: 'function findMax(arr) {\n  // Your code here\n  return Math.max(...arr);\n}',
      exampleCases: [
        { input: '[3, 7, 2, 9, 4]', output: '9' },
        { input: '[-5, -1, -10]', output: '-1' }
      ],
      testCases: [
        { input: '[3, 7, 2, 9, 4]', expectedOutput: '9' },
        { input: '[-5, -1, -10]', expectedOutput: '-1' },
        { input: '[100, 500, 250, 42]', expectedOutput: '500' }
      ]
    },
    {
      id: 'code_js_2',
      skill: 'JavaScript',
      title: 'Reverse a String',
      description: 'Write a function `reverseString(str)` that takes a string and returns it reversed.',
      inputDescription: 'A string `str`, e.g., `"hello"`.',
      outputDescription: 'Returns the reversed string, e.g., `"olleh"`.',
      starterCode: 'function reverseString(str) {\n  // Your code here\n  return str.split("").reverse().join("");\n}',
      exampleCases: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"CareerNova"', output: '"avoNreeraC"' }
      ],
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"' },
        { input: '"CareerNova"', expectedOutput: '"avoNreeraC"' },
        { input: '"12345"', expectedOutput: '"54321"' }
      ]
    }
  ],

  Python: [
    {
      id: 'code_py_1',
      skill: 'Python',
      title: 'Count Vowels in String',
      description: 'Write a function `count_vowels(s)` that counts and returns the number of vowels (a, e, i, o, u - case insensitive) in string `s`.',
      inputDescription: 'A string `s`, e.g., `"developer"`.',
      outputDescription: 'An integer count of vowels.',
      starterCode: 'def count_vowels(s):\n    vowels = "aeiouAEIOU"\n    return sum(1 for char in s if char in vowels)',
      exampleCases: [
        { input: '"developer"', output: '4' },
        { input: '"PYTHON"', output: '1' }
      ],
      testCases: [
        { input: '"developer"', expectedOutput: '4' },
        { input: '"PYTHON"', expectedOutput: '1' },
        { input: '"sky"', expectedOutput: '0' }
      ]
    }
  ],

  SQL: [
    {
      id: 'code_sql_1',
      skill: 'SQL',
      title: 'Filter High Salary Employees',
      description: 'Write a SQL query that retrieves `name` and `salary` from table `employees` where `salary` is greater than `75000`.',
      inputDescription: 'Table `employees` with columns `id`, `name`, `salary`.',
      outputDescription: 'Query result containing columns `name`, `salary`.',
      starterCode: 'SELECT name, salary FROM employees WHERE salary > 75000;',
      exampleCases: [
        { input: 'employees table', output: 'Filtered 3 employees' }
      ],
      testCases: [
        { input: 'WHERE salary > 75000', expectedOutput: 'SUCCESS' }
      ]
    }
  ],

  Java: [
    {
      id: 'code_java_1',
      skill: 'Java',
      title: 'Check Palindrome Number',
      description: 'Write a Java method `isPalindrome(int n)` that returns `true` if `n` reads the same backward as forward.',
      inputDescription: 'An integer `n`, e.g., `121`.',
      outputDescription: '`true` or `false`.',
      starterCode: 'public boolean isPalindrome(int n) {\n    int original = n, rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + n % 10;\n        n /= 10;\n    }\n    return original == rev;\n}',
      exampleCases: [
        { input: '121', output: 'true' },
        { input: '123', output: 'false' }
      ],
      testCases: [
        { input: '121', expectedOutput: 'true' },
        { input: '123', expectedOutput: 'false' },
        { input: '1221', expectedOutput: 'true' }
      ]
    }
  ],

  'C++': [
    {
      id: 'code_cpp_1',
      skill: 'C++',
      title: 'Calculate Factorial',
      description: 'Write a C++ function `long long factorial(int n)` that computes the factorial of non-negative integer `n`.',
      inputDescription: 'An integer `n` (0 <= n <= 15).',
      outputDescription: 'Returns the factorial value.',
      starterCode: 'long long factorial(int n) {\n    if (n <= 1) return 1;\n    long long ans = 1;\n    for (int i = 2; i <= n; i++) ans *= i;\n    return ans;\n}',
      exampleCases: [
        { input: '5', output: '120' },
        { input: '0', output: '1' }
      ],
      testCases: [
        { input: '5', expectedOutput: '120' },
        { input: '0', expectedOutput: '1' },
        { input: '7', expectedOutput: '5040' }
      ]
    }
  ]
}

function calculateSkillLevel(percentage) {
  if (percentage >= 85) return 'Strong'
  if (percentage >= 70) return 'Intermediate'
  if (percentage >= 40) return 'Basic'
  return 'Beginner'
}

module.exports = {
  QUESTION_BANK,
  CODING_PROBLEMS,
  calculateSkillLevel
}
