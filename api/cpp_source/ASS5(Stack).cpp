#include <iostream>
#define max 5
using namespace std;
class Stack {
private:
	int arr[max];
	int top;
public:
	Stack() {
		top = -1;
	}
	void push(int x) {
		if (top>=max-1) {
			cout << "Stack is full/Overflow"<<endl;
		}
		else {
			arr[++top] = x;
			cout << x<< " pushed in the stack"<<endl;
		}
	}
	void pop() {
		if (top<0) {
			cout << "Stack is Underflow"<<endl;
		}
		else {
			cout << " the element " << arr[top--] << " pushed out " <<endl ;
		}
	}
	void peek() {
		cout<<"The element at the top is " << arr[top] <<endl;
	}
	void display() {
		cout << "The stack is as follows " <<endl;
		for (int i = top; i >=0 ; i--) {
			cout << arr[i] << " " ;
		}
	}
};
int main()
{
	Stack stack1{};
	int ch;
	int val;
	while(true) {
		cout <<"enter your choice " <<endl;
		cout <<"1) push " <<endl;
		cout <<"2) pop " <<endl;
		cout <<"3) peek " <<endl;
		cout <<"4) display " <<endl;
		cout << "5) Exit "<<endl;
		cin >> ch;
		switch(ch) {
		case 1:
			cout <<"Enter number to be pushed " ;
			cin >> val;
			stack1.push(val);
			break;
		case 2:
			stack1.pop();
			break;
		case 3:
			stack1.peek();
			break;
		case 4:
			stack1.display();
			break;
		case 5:
			return 0;
			break;
		default:
			cout <<"enter valid choice ";
		}
	}
	return 0;
}
