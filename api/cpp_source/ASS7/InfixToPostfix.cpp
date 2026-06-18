#include <iostream>
using namespace std;

const int MAX = 20;
char expr[MAX];
char stack[MAX];
int top = -1;

void push(char op) {
    if (top < MAX - 1) stack[++top] = op;
}

char pop() {
    if (top >= 0) return stack[top--];
    return '\0'; 
}

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return -1;
}

int length(const char* str) {
    int len = 0;
    while (str[len] != '\0') len++;
    return len;
}

void reverse(char* str) {
    int start = 0, end = length(str) - 1;
    while (start < end) {
        swap(str[start], str[end]);
        start++; end--;
    }
}

int isOperand(char c) {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

void infixToPostfix(const char* infix, char* postfix) {
    top = -1;
    int idx = 0;

    for (int i = 0; i < length(infix); i++) {
        char curr = infix[i];
        if (isOperand(curr)) {
            postfix[idx++] = curr;
        } else if (curr == '(') {
            push(curr);
        } else if (curr == ')') {
            while (top != -1 && stack[top] != '(') {
                postfix[idx++] = pop();
            }
            if (top != -1 && stack[top] == '(') pop();
        } else {
            while (top != -1 && precedence(stack[top]) >= precedence(curr)) {
                postfix[idx++] = pop();
            }
            push(curr);
        }
    }
    while (top != -1) postfix[idx++] = pop();
    postfix[idx] = '\0';
}

int main() {
    cout << "Enter an infix expression: ";
    cin >> expr;

    char postfix[MAX];
    infixToPostfix(expr, postfix);
    cout << "Postfix Expression: " << postfix << endl;
    return 0;
}
