document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const sidebarNav = document.getElementById('sidebarNav');
    const algoTitle = document.getElementById('algoTitle');
    const algoCategory = document.getElementById('algoCategory');
    const algoTime = document.getElementById('algoTime');
    const algoSpace = document.getElementById('algoSpace');
    const cppSourceCode = document.getElementById('cppSourceCode');
    const theoryText = document.getElementById('theoryText');
    const pseudocodeText = document.getElementById('pseudocodeText');
    const controlsPanel = document.getElementById('controlsPanel');
    const customInput = document.getElementById('customInput');
    const targetInput = document.getElementById('targetInput');
    const runBtn = document.getElementById('runBtn');
    const randomizeBtn = document.getElementById('randomizeBtn');
    
    // DS Controls
    const standardControls = document.getElementById('standardControls');
    const dsControls = document.getElementById('dsControls');
    const dsValueInput = document.getElementById('dsValueInput');
    const dsSpeedSlider = document.getElementById('dsSpeedSlider');
    const stackBtns = document.getElementById('stackBtns');
    const pushBtn = document.getElementById('pushBtn');
    const popBtn = document.getElementById('popBtn');
    const queueBtns = document.getElementById('queueBtns');
    const enqBtn = document.getElementById('enqBtn');
    const deqBtn = document.getElementById('deqBtn');
    const infixBtns = document.getElementById('infixBtns');
    const runInfixBtn = document.getElementById('runInfixBtn');
    const sllBtns = document.getElementById('sllBtns');
    const sllInsertStartBtn = document.getElementById('sllInsertStartBtn');
    const sllInsertEndBtn = document.getElementById('sllInsertEndBtn');
    const sllDeleteStartBtn = document.getElementById('sllDeleteStartBtn');
    
    // DS State
    let dsState = [];
    const getDSDelay = () => 501 - parseInt(dsSpeedSlider.value);

    const visualizerContainer = document.getElementById('visualizerContainer');
    const visualizerLogs = document.getElementById('visualizerLogs');
    const speedSlider = document.getElementById('speedSlider');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    let currentAlgo = null;
    let isVisualizing = false;

    // --- Tab Switching ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active', 'border-blue-500', 'text-blue-400');
                b.classList.add('border-transparent', 'text-slate-400');
            });
            tabContents.forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('active');
            });

            btn.classList.remove('border-transparent', 'text-slate-400');
            btn.classList.add('active', 'border-blue-500', 'text-blue-400');
            
            const target = document.getElementById(`tab-${btn.dataset.tab}`);
            target.classList.remove('hidden');
            // Slight delay to allow display:flex to apply before setting opacity via CSS transition
            setTimeout(() => {
                target.classList.add('active');
            }, 10);
        });
    });

    // --- Logger ---
    const log = (msg, type = 'info') => {
        const span = document.createElement('span');
        const colors = { info: 'text-slate-300', success: 'text-emerald-400', error: 'text-red-400', warn: 'text-amber-400' };
        span.className = colors[type] || colors.info;
        span.innerHTML = `> ${msg}<br>`;
        visualizerLogs.appendChild(span);
        visualizerLogs.scrollTop = visualizerLogs.scrollHeight;
    };

    const clearLogs = () => { visualizerLogs.innerHTML = ''; };

    // --- API Fetching ---
    async function fetchAlgorithms() {
        try {
            const res = await fetch('/api/algorithms');
            const data = await res.json();
            renderSidebar(data);
        } catch (e) {
            sidebarNav.innerHTML = `<div class="text-red-400 text-sm p-4">Error loading API</div>`;
        }
    }

    async function loadAlgorithm(id) {
        if(isVisualizing) {
            alert("Visualization in progress. Please wait.");
            return;
        }
        
        // UI Reset
        visualizerContainer.innerHTML = '';
        clearLogs();
        log(`Loading ${id} system data...`);

        try {
            const res = await fetch(`/api/algorithm/${id}`);
            const data = await res.json();
            currentAlgo = data;

            // Update Header
            algoTitle.textContent = data.name;
            algoCategory.textContent = data.category;
            algoTime.textContent = `Time: ${data.timeComplexity}`;
            algoSpace.textContent = `Space: ${data.spaceComplexity}`;

            // Update Code & Theory
            cppSourceCode.textContent = data.sourceCode;
            theoryText.textContent = data.theory;
            pseudocodeText.textContent = data.pseudocode;

            // Apply Syntax Highlighting
            hljs.highlightElement(cppSourceCode);

            // Controls Visibility
            controlsPanel.classList.remove('opacity-0');
            if (data.category === 'Searching') {
                targetInput.classList.remove('hidden');
            } else {
                targetInput.classList.add('hidden');
            }

            // Defaults
            populateInput(data);

            log(`${data.name} loaded successfully. Ready to visualize.`, 'success');

        } catch (e) {
            log(`Failed to load data: ${e.message}`, 'error');
        }
    }

    function populateInput(data) {
        if (!data) return;

        // Reset UI Context
        if(standardControls) standardControls.classList.remove('hidden');
        if(dsControls) dsControls.classList.add('hidden');
        if(stackBtns) stackBtns.classList.add('hidden');
        if(queueBtns) queueBtns.classList.add('hidden');
        if(infixBtns) infixBtns.classList.add('hidden');
        if(sllBtns) sllBtns.classList.add('hidden');
        
        dsState = [];
        if(dsValueInput) dsValueInput.value = '';

        if (data.category === 'Linear Data Structures' || data.category === 'Linked Lists' || data.category === 'Expression Parsing') {
            standardControls.classList.add('hidden');
            dsControls.classList.remove('hidden');
            visualizerContainer.innerHTML = '';
            
            if (data.id === 'stack') {
                stackBtns.classList.remove('hidden');
                dsValueInput.placeholder = "Value to Push";
                dsValueInput.value = "42";
                drawNodes(dsState, 'Stack Operations (Right is Top)');
            } else if (data.id === 'queue') {
                queueBtns.classList.remove('hidden');
                dsValueInput.placeholder = "Value to Enqueue";
                dsValueInput.value = "42";
                drawNodes(dsState, 'Queue Operations (Left is Front)');
            } else if (data.id.startsWith('sll_')) {
                sllBtns.classList.remove('hidden');
                dsValueInput.placeholder = "Value to Insert";
                dsValueInput.value = "10";
                drawNodes(dsState, 'Singly Linked List');
            } else if (data.id === 'infix_postfix') {
                infixBtns.classList.remove('hidden');
                dsValueInput.placeholder = "Expression (e.g. A+B*C)";
                dsValueInput.value = "A+B*C";
            }
            return;
        }

        if (data.category === 'Sorting') {
            if (data.id === 'merge' || data.id === 'quick') {
                customInput.value = Array.from({length: 50}, () => Math.floor(Math.random() * 100) + 5).join(', ');
            } else {
                customInput.value = Array.from({length: 25}, () => Math.floor(Math.random() * 100) + 5).join(', ');
            }
        }
        else if (data.category === 'Searching') {
            let sortedArr = Array.from({length: 20}, () => Math.floor(Math.random() * 100) + 5).sort((a,b)=>a-b);
            customInput.value = sortedArr.join(', ');
            targetInput.value = sortedArr[Math.floor(Math.random() * sortedArr.length)];
        }
        else customInput.value = "10, 20, 30";
        drawInitial();
    }

    randomizeBtn.addEventListener('click', () => {
        populateInput(currentAlgo);
        log('Array randomized.', 'info');
    });

    // --- DS PLAYGROUND LISTENERS ---
    pushBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.push(val);
        log(`Pushed ${val} to stack`);
        drawNodes(dsState, 'Stack Operations (Right is Top)');
    });

    popBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        if(dsState.length === 0) { log('Stack Underflow!', 'error'); return; }
        const val = dsState.pop();
        log(`Popped ${val} from stack`, 'success');
        drawNodes(dsState, 'Stack Operations (Right is Top)');
    });

    enqBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.push(val);
        log(`Enqueued ${val}`);
        drawNodes(dsState, 'Queue Operations (Left is Front)');
    });

    deqBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        if(dsState.length === 0) { log('Queue Underflow!', 'error'); return; }
        const val = dsState.shift();
        log(`Dequeued ${val}`, 'success');
        drawNodes(dsState, 'Queue Operations (Left is Front)');
    });
    
    sllInsertStartBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.unshift(val);
        log(`Inserted ${val} at start of SLL`);
        drawNodes(dsState, 'Singly Linked List');
    });

    sllInsertEndBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.push(val);
        log(`Inserted ${val} at end of SLL`);
        drawNodes(dsState, 'Singly Linked List');
    });

    sllDeleteStartBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        if(dsState.length === 0) { log('List is empty!', 'error'); return; }
        const val = dsState.shift();
        log(`Deleted ${val} from SLL`);
        drawNodes(dsState, 'Singly Linked List');
    });

    runInfixBtn.addEventListener('click', async () => {
        if(isVisualizing) return;
        const expr = dsValueInput.value.trim().toUpperCase();
        if(!expr) return;
        await visInfixPostfix(expr);
    });

    async function visInfixPostfix(expr) {
        isVisualizing = true;
        visualizerContainer.innerHTML = '';
        
        const stackCont = document.createElement('div');
        stackCont.className = 'flex flex-col gap-2 items-center mr-16';
        const stackTitle = document.createElement('div');
        stackTitle.textContent = 'Stack'; stackTitle.className = 'text-xs text-slate-400 font-bold mb-2';
        stackCont.appendChild(stackTitle);
        
        const outputCont = document.createElement('div');
        outputCont.className = 'flex gap-2 items-center flex-wrap max-w-[60%]';
        const outputTitle = document.createElement('div');
        outputTitle.textContent = 'Output: '; outputTitle.className = 'text-xs text-slate-400 font-bold mr-2';
        outputCont.appendChild(outputTitle);
        
        const wrap = document.createElement('div');
        wrap.className = 'flex w-full items-start justify-center mt-12';
        wrap.appendChild(stackCont);
        wrap.appendChild(outputCont);
        visualizerContainer.appendChild(wrap);

        let stack = [];
        let output = "";
        
        function precedence(c) {
            if(c === '^') return 3;
            if(c === '/' || c === '*') return 2;
            if(c === '+' || c === '-') return 1;
            return -1;
        }

        for (let i = 0; i < expr.length; i++) {
            let c = expr[i];
            log(`Processing '${c}'`);
            await sleep(getDSDelay());

            if (/[a-zA-Z0-9]/.test(c)) {
                output += c;
                log(`Added '${c}' to output`);
                const node = document.createElement('div');
                node.className = 'w-8 h-8 flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold border border-blue-500/50 rounded-md shadow-lg animate-fade-in transition-all';
                node.textContent = c;
                outputCont.appendChild(node);
            } 
            else if (c === '(') {
                stack.push(c);
                renderStackVis(stack, stackCont);
                log(`Pushed '(' to stack`);
            } 
            else if (c === ')') {
                while(stack.length > 0 && stack[stack.length - 1] !== '(') {
                    let op = stack.pop();
                    output += op;
                    const node = document.createElement('div');
                    node.className = 'w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/50 rounded-md shadow-lg animate-fade-in transition-all';
                    node.textContent = op;
                    outputCont.appendChild(node);
                    renderStackVis(stack, stackCont);
                    await sleep(getDSDelay());
                }
                if(stack.length > 0 && stack[stack.length - 1] === '(') {
                    stack.pop();
                    renderStackVis(stack, stackCont);
                }
            } 
            else {
                while(stack.length > 0 && precedence(c) <= precedence(stack[stack.length - 1])) {
                    let op = stack.pop();
                    output += op;
                    const node = document.createElement('div');
                    node.className = 'w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/50 rounded-md shadow-lg animate-fade-in transition-all';
                    node.textContent = op;
                    outputCont.appendChild(node);
                    renderStackVis(stack, stackCont);
                    await sleep(getDSDelay());
                }
                stack.push(c);
                renderStackVis(stack, stackCont);
                log(`Pushed '${c}' to stack`);
            }
            await sleep(getDSDelay());
        }

        while(stack.length > 0) {
            let op = stack.pop();
            output += op;
            const node = document.createElement('div');
            node.className = 'w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/50 rounded-md shadow-lg animate-fade-in transition-all';
            node.textContent = op;
            outputCont.appendChild(node);
            renderStackVis(stack, stackCont);
            await sleep(getDSDelay());
        }
        
        log(`Final Postfix: ${output}`, 'success');
        isVisualizing = false;
    }

    function renderStackVis(stackArr, container) {
        while (container.childNodes.length > 1) {
            container.removeChild(container.lastChild);
        }
        for(let i=stackArr.length-1; i>=0; i--) {
            const node = document.createElement('div');
            node.className = 'w-10 h-10 flex items-center justify-center bg-slate-800 border-2 border-slate-600 rounded-lg text-white font-bold animate-slide-down transition-all';
            node.textContent = stackArr[i];
            container.appendChild(node);
        }
    }

    function drawInitial() {
        if (!currentAlgo) return;
        let arr = [];
        try { arr = customInput.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)); } catch(e) { return; }
        if(currentAlgo.category === 'Linked Lists' || currentAlgo.category === 'Linear Data Structures') {
            drawNodes(arr, currentAlgo.name);
        } else {
            drawBars(arr);
        }
    }

    function renderSidebar(algorithms) {
        sidebarNav.innerHTML = '';
        // Group by category
        const groups = {};
        Object.values(algorithms).forEach(algo => {
            if(!groups[algo.category]) groups[algo.category] = [];
            groups[algo.category].push(algo);
        });

        for (const [category, algos] of Object.entries(groups)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'mb-6';
            groupDiv.innerHTML = `<h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">${category}</h3>`;
            
            algos.forEach(algo => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-item w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-400 font-medium flex items-center gap-2 mb-1';
                btn.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-slate-600 indicator"></span> ${algo.name}`;
                btn.onclick = () => {
                    document.querySelectorAll('.sidebar-item').forEach(b => {
                        b.classList.remove('active');
                        b.querySelector('.indicator').classList.remove('bg-blue-500');
                        b.querySelector('.indicator').classList.add('bg-slate-600');
                    });
                    btn.classList.add('active');
                    btn.querySelector('.indicator').classList.remove('bg-slate-600');
                    btn.querySelector('.indicator').classList.add('bg-blue-500');
                    loadAlgorithm(algo.id);
                };
                groupDiv.appendChild(btn);
            });
            sidebarNav.appendChild(groupDiv);
        }
    }

    // --- Visualizer Utils ---
    const getDelay = () => 501 - parseInt(speedSlider.value);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const drawBars = (arr) => {
        visualizerContainer.innerHTML = '';
        const maxVal = Math.max(...arr) || 1;
        arr.forEach((val, i) => {
            const bar = document.createElement('div');
            bar.className = 'graph-bar';
            bar.style.height = `${(val / maxVal) * 100}%`;
            bar.id = `bar-${i}`;
            bar.textContent = val;
            visualizerContainer.appendChild(bar);
        });
    };

    const drawNodes = (arr, title="Structure") => {
        visualizerContainer.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center gap-4"><h3 class="text-slate-400">${title}</h3><div class="flex items-center gap-2" id="nodeContainer"></div></div>`;
        const container = document.getElementById('nodeContainer');
        arr.forEach((val, i) => {
            const node = document.createElement('div');
            node.className = 'ds-node';
            node.id = `node-${i}`;
            node.textContent = val;
            container.appendChild(node);
            
            // Add arrow if linked list
            if (currentAlgo.category === 'Linked Lists' && i < arr.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'ds-arrow';
                container.appendChild(arrow);
            }
        });
    };

    // --- ALGORITHMS RUNNER ---
    
    // Bubble Sort Visualizer
    async function visBubbleSort(arr) {
        drawBars(arr);
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                const b1 = document.getElementById(`bar-${j}`);
                const b2 = document.getElementById(`bar-${j+1}`);
                b1.classList.add('comparing'); b2.classList.add('comparing');
                await sleep(getDelay());

                if (arr[j] > arr[j + 1]) {
                    log(`Swapping ${arr[j]} and ${arr[j+1]}`);
                    b1.classList.add('swapping'); b2.classList.add('swapping');
                    
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    
                    // Update DOM visually
                    b1.style.height = b2.style.height;
                    b1.textContent = arr[j];
                    b2.style.height = `${(arr[j+1] / Math.max(...arr)) * 100}%`;
                    b2.textContent = arr[j+1];
                    await sleep(getDelay());
                    b1.classList.remove('swapping'); b2.classList.remove('swapping');
                }
                b1.classList.remove('comparing'); b2.classList.remove('comparing');
            }
            document.getElementById(`bar-${n - i - 1}`).classList.add('sorted');
        }
        document.getElementById(`bar-0`).classList.add('sorted');
        log('Bubble sort complete!', 'success');
    }

    // Selection Sort Visualizer
    async function visSelectionSort(arr) {
        drawBars(arr);
        let n = arr.length;
        for (let i = 0; i < n; i++) {
            let min_idx = i;
            const bI = document.getElementById(`bar-${i}`);
            bI.classList.add('swapping'); // Highlighting the current starting position

            for (let j = i + 1; j < n; j++) {
                const bJ = document.getElementById(`bar-${j}`);
                bJ.classList.add('comparing');
                await sleep(getDelay());
                
                if (arr[j] < arr[min_idx]) {
                    if(min_idx !== i) document.getElementById(`bar-${min_idx}`).classList.remove('swapping');
                    min_idx = j;
                    document.getElementById(`bar-${min_idx}`).classList.add('swapping');
                }
                bJ.classList.remove('comparing');
            }

            if (min_idx !== i) {
                log(`Swapping minimum ${arr[min_idx]} with ${arr[i]}`);
                const bMin = document.getElementById(`bar-${min_idx}`);
                
                let temp = arr[i];
                arr[i] = arr[min_idx];
                arr[min_idx] = temp;
                
                bI.style.height = bMin.style.height;
                bI.textContent = arr[i];
                bMin.style.height = `${(arr[min_idx] / Math.max(...arr)) * 100}%`;
                bMin.textContent = arr[min_idx];
                bMin.classList.remove('swapping');
                await sleep(getDelay() * 2);
            }
            bI.classList.remove('swapping');
            bI.classList.add('sorted');
        }
        log('Selection sort complete!', 'success');
    }

    // Insertion Sort Visualizer
    async function visInsertionSort(arr) {
        drawBars(arr);
        let n = arr.length;
        document.getElementById(`bar-0`).classList.add('sorted');
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            
            const bKey = document.getElementById(`bar-${i}`);
            bKey.classList.add('swapping');
            await sleep(getDelay());
            
            while (j >= 0 && arr[j] > key) {
                log(`Moving ${arr[j]} to the right`);
                const bNext = document.getElementById(`bar-${j+1}`);
                const bCurr = document.getElementById(`bar-${j}`);
                
                arr[j + 1] = arr[j];
                bNext.style.height = bCurr.style.height;
                bNext.textContent = arr[j+1];
                
                bNext.classList.add('comparing');
                await sleep(getDelay());
                bNext.classList.remove('comparing');
                bNext.classList.add('sorted');
                j = j - 1;
            }
            arr[j + 1] = key;
            const bInsert = document.getElementById(`bar-${j+1}`);
            bInsert.style.height = `${(key / Math.max(...arr)) * 100}%`;
            bInsert.textContent = key;
            bInsert.classList.remove('swapping');
            bInsert.classList.add('sorted');
            
            // Re-apply sorted class just to be safe
            for(let k=0; k<=i; k++) document.getElementById(`bar-${k}`).classList.add('sorted');
        }
        log('Insertion sort complete!', 'success');
    }

    // Linear Search Visualizer
    async function visLinearSearch(arr, target) {
        drawBars(arr);
        for(let i=0; i<arr.length; i++) {
            const b = document.getElementById(`bar-${i}`);
            b.classList.add('comparing');
            log(`Checking if ${arr[i]} == ${target}`);
            await sleep(getDelay());
            if(arr[i] === target) {
                b.classList.remove('comparing');
                b.classList.add('sorted');
                log(`Found ${target} at index ${i}!`, 'success');
                return;
            }
            b.classList.remove('comparing');
            b.classList.add('opacity-50'); // Dim checked ones
        }
        log(`Target ${target} not found.`, 'warn');
    }

    // Binary Search Visualizer
    async function visBinarySearch(arr, target) {
        drawBars(arr);
        let low = 0; let high = arr.length - 1;
        while(low <= high) {
            let mid = Math.floor((low + high) / 2);
            log(`Search Bounds: [${low} - ${high}], Mid: ${mid}`);
            
            // Highlight bounds
            for(let i=0; i<arr.length; i++) {
                const b = document.getElementById(`bar-${i}`);
                b.classList.remove('swapping');
                if(i >= low && i <= high) b.classList.remove('opacity-25');
                else b.classList.add('opacity-25');
            }

            const bMid = document.getElementById(`bar-${mid}`);
            bMid.classList.add('comparing');
            await sleep(getDelay() * 1.5);

            if(arr[mid] === target) {
                bMid.classList.remove('comparing');
                bMid.classList.add('sorted');
                log(`Found ${target} at index ${mid}!`, 'success');
                return;
            } else if (arr[mid] < target) {
                log(`${arr[mid]} < ${target}. Searching right half.`);
                bMid.classList.add('swapping');
                low = mid + 1;
            } else {
                log(`${arr[mid]} > ${target}. Searching left half.`);
                bMid.classList.add('swapping');
                high = mid - 1;
            }
            await sleep(getDelay());
        }
        log(`Target ${target} not found.`, 'warn');
    }

    // Merge Sort Visualizer
    async function visMergeSort(arr) {
        drawBars(arr);
        const maxVal = Math.max(...arr) || 1;
        
        async function merge(l, m, r) {
            let n1 = m - l + 1;
            let n2 = r - m;
            let L = new Array(n1);
            let R = new Array(n2);
            for (let i = 0; i < n1; i++) L[i] = arr[l + i];
            for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
            
            let i = 0, j = 0, k = l;
            while (i < n1 && j < n2) {
                const b = document.getElementById(`bar-${k}`);
                b.classList.add('comparing');
                await sleep(getDelay());
                
                if (L[i] <= R[j]) {
                    arr[k] = L[i]; i++;
                } else {
                    arr[k] = R[j]; j++;
                }
                b.style.height = `${(arr[k] / maxVal) * 100}%`;
                b.textContent = arr[k];
                b.classList.remove('comparing');
                b.classList.add('sorted');
                k++;
            }
            while (i < n1) {
                const b = document.getElementById(`bar-${k}`);
                arr[k] = L[i]; i++;
                b.style.height = `${(arr[k] / maxVal) * 100}%`;
                b.textContent = arr[k];
                b.classList.add('sorted');
                k++;
                await sleep(getDelay());
            }
            while (j < n2) {
                const b = document.getElementById(`bar-${k}`);
                arr[k] = R[j]; j++;
                b.style.height = `${(arr[k] / maxVal) * 100}%`;
                b.textContent = arr[k];
                b.classList.add('sorted');
                k++;
                await sleep(getDelay());
            }
        }
        
        async function mergeSortHelper(l, r) {
            if (l >= r) return;
            let m = l + Math.floor((r - l) / 2);
            await mergeSortHelper(l, m);
            await mergeSortHelper(m + 1, r);
            await merge(l, m, r);
        }
        
        log('Starting Merge Sort...');
        await mergeSortHelper(0, arr.length - 1);
        log('Merge sort complete!', 'success');
    }

    // Quick Sort Visualizer
    async function visQuickSort(arr) {
        drawBars(arr);
        const maxVal = Math.max(...arr) || 1;
        
        async function partition(low, high) {
            let pivot = arr[high];
            const bPivot = document.getElementById(`bar-${high}`);
            bPivot.classList.add('swapping'); 
            
            let i = low - 1;
            for (let j = low; j <= high - 1; j++) {
                const bJ = document.getElementById(`bar-${j}`);
                bJ.classList.add('comparing');
                await sleep(getDelay());
                
                if (arr[j] < pivot) {
                    i++;
                    log(`Swapping ${arr[i]} and ${arr[j]}`);
                    const bI = document.getElementById(`bar-${i}`);
                    
                    let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                    
                    bI.style.height = `${(arr[i] / maxVal) * 100}%`; bI.textContent = arr[i];
                    bJ.style.height = `${(arr[j] / maxVal) * 100}%`; bJ.textContent = arr[j];
                }
                bJ.classList.remove('comparing');
            }
            
            let temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
            const bI1 = document.getElementById(`bar-${i+1}`);
            
            bI1.style.height = `${(arr[i+1] / maxVal) * 100}%`; bI1.textContent = arr[i+1];
            bPivot.style.height = `${(arr[high] / maxVal) * 100}%`; bPivot.textContent = arr[high];
            
            bPivot.classList.remove('swapping');
            bI1.classList.add('sorted');
            await sleep(getDelay());
            
            return i + 1;
        }
        
        async function quickSortHelper(low, high) {
            if (low < high) {
                let pi = await partition(low, high);
                await quickSortHelper(low, pi - 1);
                await quickSortHelper(pi + 1, high);
            } else if (low === high) {
                document.getElementById(`bar-${low}`).classList.add('sorted');
            }
        }
        
        log('Starting Quick Sort...');
        await quickSortHelper(0, arr.length - 1);
        for(let i=0; i<arr.length; i++) document.getElementById(`bar-${i}`).classList.add('sorted');
        log('Quick sort complete!', 'success');
    }

    // Generic fallback for others
    async function visGeneric(arr) {
        log('Visualization for this structure is running in simulated mode.', 'warn');
        if(currentAlgo.category === 'Linked Lists' || currentAlgo.category === 'Linear Data Structures') {
            drawNodes(arr, currentAlgo.name);
            await sleep(getDelay() * 2);
            const container = document.getElementById('nodeContainer');
            if(currentAlgo.id.includes('insert') || currentAlgo.id === 'queue' || currentAlgo.id === 'stack') {
                const newNode = document.createElement('div');
                newNode.className = 'ds-node active';
                newNode.textContent = "New";
                if(currentAlgo.id.includes('start') || currentAlgo.id === 'stack') container.prepend(newNode);
                else container.appendChild(newNode);
                log('Element Added', 'success');
            } else if (currentAlgo.id.includes('delete')) {
                if(container.lastChild) container.lastChild.remove();
                log('Element Removed', 'success');
            }
        } else {
            drawBars(arr);
            await sleep(getDelay() * 2);
            arr.sort((a,b)=>a-b);
            drawBars(arr);
            document.querySelectorAll('.graph-bar').forEach(b => b.classList.add('sorted'));
            log('Array sorted (Simulated fast-forward)', 'success');
        }
    }

    // Execute Button Logic
    runBtn.addEventListener('click', async () => {
        if (!currentAlgo) return;
        if (isVisualizing) return;
        
        isVisualizing = true;
        runBtn.disabled = true;
        runBtn.classList.add('opacity-50', 'cursor-not-allowed');
        clearLogs();
        
        let arr = [];
        try {
            arr = customInput.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if(arr.length === 0) throw new Error();
        } catch(e) {
            log('Invalid input. Provide comma-separated numbers.', 'error');
            isVisualizing = false;
            runBtn.disabled = false;
            runBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            return;
        }

        log(`Starting ${currentAlgo.name} execution...`);
        
        try {
            if (currentAlgo.id === 'bubble') {
                await visBubbleSort(arr);
            } else if (currentAlgo.id === 'selection') {
                await visSelectionSort(arr);
            } else if (currentAlgo.id === 'insertion') {
                await visInsertionSort(arr);
            } else if (currentAlgo.id === 'merge') {
                await visMergeSort(arr);
            } else if (currentAlgo.id === 'quick') {
                await visQuickSort(arr);
            } else if (currentAlgo.id === 'linear_search') {
                const target = parseInt(targetInput.value);
                if(isNaN(target)) throw new Error("Invalid target");
                await visLinearSearch(arr, target);
            } else if (currentAlgo.id.includes('binary_search')) {
                const target = parseInt(targetInput.value);
                if(isNaN(target)) throw new Error("Invalid target");
                await visBinarySearch(arr, target);
            } else {
                // Fallback visualizer
                await visGeneric(arr);
            }
        } catch (err) {
            log(`Visualization error: ${err.message}`, 'error');
        }

        isVisualizing = false;
        runBtn.disabled = false;
        runBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    });

    // --- Init ---
    fetchAlgorithms();
});
