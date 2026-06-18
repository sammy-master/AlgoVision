from flask import Flask, jsonify, send_from_directory
import os

# To support running locally without Vercel CLI, we serve static files from the parent directory
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
app = Flask(__name__, static_folder=static_dir, static_url_path='')

# Algorithm Metadata & Mapping to C++ Files
ALGORITHMS = {
    "bubble": {
        "id": "bubble",
        "name": "Bubble Sort",
        "category": "Sorting",
        "file": "ASS2(Bubble,Selection,Insertion)Sorting.cpp",
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(1)",
        "theory": "Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not suitable for large data sets.",
        "pseudocode": "for i from 0 to N-1:\n  for j from 0 to N-i-1:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])"
    },
    "selection": {
        "id": "selection",
        "name": "Selection Sort",
        "category": "Sorting",
        "file": "ASS2(Bubble,Selection,Insertion)Sorting.cpp",
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(1)",
        "theory": "Selection sort is a simple and efficient sorting algorithm that works by repeatedly selecting the smallest (or largest) element from the unsorted portion of the list and moving it to the sorted portion.",
        "pseudocode": "for i from 0 to N-1:\n  min_idx = i\n  for j from i+1 to N:\n    if arr[j] < arr[min_idx]:\n      min_idx = j\n  swap(arr[i], arr[min_idx])"
    },
    "insertion": {
        "id": "insertion",
        "name": "Insertion Sort",
        "category": "Sorting",
        "file": "ASS2(Bubble,Selection,Insertion)Sorting.cpp",
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(1)",
        "theory": "Insertion sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
        "pseudocode": "for i from 1 to N:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j = j - 1\n  arr[j+1] = key"
    },
    "merge": {
        "id": "merge",
        "name": "Merge Sort",
        "category": "Sorting",
        "file": "ASS3(Merge_Sort).cpp",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "theory": "Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
        "pseudocode": "MergeSort(arr, l, r):\n  if l < r:\n    m = l + (r - l) / 2\n    MergeSort(arr, l, m)\n    MergeSort(arr, m+1, r)\n    Merge(arr, l, m, r)"
    },
    "quick": {
        "id": "quick",
        "name": "Quick Sort",
        "category": "Sorting",
        "file": "ASS4(Quick_Sort).cpp",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(log N)",
        "theory": "QuickSort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.",
        "pseudocode": "QuickSort(arr, low, high):\n  if low < high:\n    pi = partition(arr, low, high)\n    QuickSort(arr, low, pi - 1)\n    QuickSort(arr, pi + 1, high)"
    },
    "linear_search": {
        "id": "linear_search",
        "name": "Linear Search",
        "category": "Searching",
        "file": "ASS1/Linear_Search.cpp",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "theory": "Linear search is a very simple search algorithm. In this type of search, a sequential search is made over all items one by one.",
        "pseudocode": "for each item in the array:\n  if item == value:\n    return its index"
    },
    "binary_search_iter": {
        "id": "binary_search_iter",
        "name": "Binary Search (Iterative)",
        "category": "Searching",
        "file": "ASS1/Binary_Search(Non Recursive).cpp",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "theory": "Search a sorted array by repeatedly dividing the search interval in half. Begin with an interval covering the whole array.",
        "pseudocode": "while low <= high:\n  mid = low + (high - low) / 2\n  if arr[mid] == x: return mid\n  if arr[mid] < x: low = mid + 1\n  else: high = mid - 1"
    },
    "binary_search_rec": {
        "id": "binary_search_rec",
        "name": "Binary Search (Recursive)",
        "category": "Searching",
        "file": "ASS1/Binary_Search(Recursive).cpp",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(log N)",
        "theory": "Recursive implementation of Binary Search that calls itself on a smaller sub-array.",
        "pseudocode": "BinarySearch(arr, low, high, x):\n  if high >= low:\n    mid = low + (high - low) / 2\n    if arr[mid] == x: return mid\n    if arr[mid] > x: return BinarySearch(arr, low, mid - 1, x)\n    return BinarySearch(arr, mid + 1, high, x)"
    },
    "stack": {
        "id": "stack",
        "name": "Stack Operations",
        "category": "Linear Data Structures",
        "file": "ASS5(Stack).cpp",
        "timeComplexity": "O(1) for push/pop",
        "spaceComplexity": "O(N)",
        "theory": "Stack is a linear data structure which follows a particular order in which the operations are performed. The order may be LIFO(Last In First Out) or FILO(First In Last Out).",
        "pseudocode": "Push:\n  if top == MAX-1: overflow\n  else: stack[++top] = data\n\nPop:\n  if top == -1: underflow\n  else: return stack[top--]"
    },
    "queue": {
        "id": "queue",
        "name": "Queue Operations",
        "category": "Linear Data Structures",
        "file": "ASS6(Queue).cpp",
        "timeComplexity": "O(1) for enqueue/dequeue",
        "spaceComplexity": "O(N)",
        "theory": "A Queue is a linear structure which follows a particular order in which the operations are performed. The order is First In First Out (FIFO).",
        "pseudocode": "Enqueue:\n  if rear == MAX-1: overflow\n  else: queue[++rear] = data\n\nDequeue:\n  if front == rear: underflow\n  else: return queue[++front]"
    },
    "sll_insert_start": {
        "id": "sll_insert_start",
        "name": "SLL: Insert at Beginning",
        "category": "Linked Lists",
        "file": "ASS8/insert(at beginning).cpp",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "theory": "Inserting a new node at the beginning of a Singly Linked List.",
        "pseudocode": "newNode->next = head\nhead = newNode"
    },
    "sll_insert_end": {
        "id": "sll_insert_end",
        "name": "SLL: Insert at End",
        "category": "Linked Lists",
        "file": "ASS8/insert(at end).cpp",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "theory": "Inserting a new node at the end of a Singly Linked List.",
        "pseudocode": "while temp->next != null:\n  temp = temp->next\ntemp->next = newNode"
    },
    "sll_delete_start": {
        "id": "sll_delete_start",
        "name": "SLL: Delete at Beginning",
        "category": "Linked Lists",
        "file": "ASS8/delete(at beginning).cpp",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "theory": "Deleting the first node of a Singly Linked List.",
        "pseudocode": "temp = head\nhead = head->next\nfree(temp)"
    },
    "infix_postfix": {
        "id": "infix_postfix",
        "name": "Infix to Postfix",
        "category": "Expression Parsing",
        "file": "ASS7/InfixToPostfix.cpp",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "theory": "Algorithm to convert infix expression to postfix expression using a Stack data structure.",
        "pseudocode": "For each char in expression:\n  if operand: output it\n  if '(': push to stack\n  if ')': pop and output until '('\n  if operator: pop and output operators with higher/equal precedence, then push"
    }
}

@app.route('/')
def serve_index():
    return send_from_directory(static_dir, 'index.html')

@app.route('/api/algorithms')
def get_algorithms():
    return jsonify(ALGORITHMS)

@app.route('/api/algorithm/<algo_id>')
def get_algorithm_details(algo_id):
    if algo_id not in ALGORITHMS:
        return jsonify({"error": "Algorithm not found"}), 404
    
    algo = ALGORITHMS[algo_id]
    
    # Read the C++ source file
    source_code = "// Source file not found."
    try:
        # In Vercel serverless, __file__ points to api/index.py, so cpp_source is in the same dir
        file_path = os.path.join(os.path.dirname(__file__), 'cpp_source', algo['file'])
        with open(file_path, 'r', encoding='utf-8') as f:
            source_code = f.read()
    except Exception as e:
        source_code = f"// Error reading file: {str(e)}"
        
    response = {
        **algo,
        "sourceCode": source_code
    }
    return jsonify(response)

# Vercel requires the app to be available, the handler is `app`
if __name__ == '__main__':
    print(f"Running local server... open http://localhost:5000")
    app.run(debug=True, port=5000)
