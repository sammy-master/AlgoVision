#include <iostream>
using namespace std;

#define MAX 5

int queueArr[MAX];
int front = -1;
int rear = -1;

void enqueue(int x) {
    if (rear == MAX - 1) {
        cout << "Queue Overflow (Full)\n";
        return;
    }

    if (front == -1) front = 0; 

    rear++;
    queueArr[rear] = x;
    cout << x << " enqueued.\n";
}

void dequeue() {
    if (front == -1 || front > rear) {
        cout << "Queue Underflow (Empty)\n";
        return;
    }

    cout << queueArr[front] << " dequeued.\n";
    front++;
}

void peek() {
    if (front == -1 || front > rear) {
        cout << "Queue is Empty\n";
    } else {
        cout << "Front element: " << queueArr[front] << endl;
    }
}

void display() {
    if (front == -1 || front > rear) {
        cout << "Queue is Empty\n";
        return;
    }

    cout << "Queue elements: ";
    for (int i = front; i <= rear; i++) {
        cout << queueArr[i] << " ";
    }
    cout << endl;
}

int main() {
    int choice, value;

    while (true) {
        cout << "\n--- QUEUE MENU ---\n";
        cout << "1. Enqueue\n";
        cout << "2. Dequeue\n";
        cout << "3. Peek (Front)\n";
        cout << "4. Display Queue\n";
        cout << "5. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Enter value to enqueue: ";
                cin >> value;
                enqueue(value);
                break;

            case 2:
                dequeue();
                break;

            case 3:
                peek();
                break;

            case 4:
                display();
                break;

            case 5:
                cout << "Exiting...\n";
                return 0;

            default:
                cout << "Invalid Choice!\n";
        }
    }
}
