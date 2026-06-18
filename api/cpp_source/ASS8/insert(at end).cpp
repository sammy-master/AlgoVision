#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    Node(int x) {
        data = x;
        next = nullptr;
    }
};

Node* insertAtEnd(Node* head, int x) {
  
    // Create a new node
    Node* newNode = new Node(x);

    if (head == nullptr) {
        return newNode;
    }

    Node* last = head;

    while (last->next != nullptr) {
        last = last->next;
    }

    last->next = newNode;

    return head;
}

void printList(Node* node) {
    while (node != nullptr) {
        cout << node->data;
        if (node->next != nullptr) {
            cout << " -> ";
        }
        node = node->next;
    }
    cout << endl;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    head->next->next->next->next = new Node(5);

    head = insertAtEnd(head, 6);

    printList(head);

    return 0;
}