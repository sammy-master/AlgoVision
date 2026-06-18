#include <iostream>
using namespace std;
void swap(int &a,int &b) {
	int temp = a;
	a=b;
	b=temp;
}
void bubblesort(int arr[], int n) {
	for (int i = 0; i < n-1; i++) {
		for (int j = 0; j < n-i-1; j++) {
			if(arr[j] > arr[j+1]) swap(arr[j],arr[j+1]);  
		}
	}
}
void selectionSort(int arr[], int n) {
	for (int i = 0; i < n-1; i++) {
		int min = i;
		for (int j = i; j < n; j++) {
			if(arr[j] < arr[min]) min = j;
		}
		if (min != i) swap(arr[i],arr[min]);
	}
}
void insertionsort(int a[] , int n){
    for (int i = 0; i < n; i++) {
        int x = a[i];
        int j=i-1;
        while(j>=0 && a[j] > x){
            a[j+1] = a[j];
            j--;
        }
        a[j+1] = x;
    }
}
int main()
{
	int n,choice;
	cout<<"Enter number of elements "<<endl;
	cin >>n;
	cout<<"Enter elements of the array "<<endl;
	int arr[n];
	for (int i = 0; i < n; i++) {
		cin >> arr[i];
	}
	cout << "Enter the choice which you want to execute:-"<<endl;
	cout<<"1) Bubble Sort "<<endl;
	cout<<"2) Selection Sort"<<endl;
	cout<<"3) Insertion Sort"<<endl;
	cin>>choice;
	switch(choice) {
	case 1:
		bubblesort(arr,n);
		break;
	case 2:
		selectionSort(arr,n);
		break;
	case 3:
		insertionsort(arr,n);
		break;
	default:
		cout<<"Enter appropriate choice "<<endl;
		return 1;
	}
	cout<<"The sorted array is "<<endl;
	for (int i = 0; i < n; i++) {
		cout<<arr[i]<<" ";
	}
	return 0;
}
