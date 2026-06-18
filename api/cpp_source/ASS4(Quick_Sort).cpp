#include <iostream>
using namespace std;

int partition(int arr[], int low, int high) {
    int mid = (low + high) / 2;
    int pivot = arr[mid];

    int l = low;
    int r = high;

    while (l <= r) {

        // Move left pointer until value >= pivot
        while (arr[l] < pivot)
            l++;

        // Move right pointer until value <= pivot
        while (arr[r] > pivot)
            r--;

        // Swap if left index <= right index
        if (l <= r) {
            int temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;

            l++;
            r--;
        }
    }
    return l;   // partition index
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int index = partition(arr, low, high);

        // Recursively sort the left part
        quickSort(arr, low, index - 1);

        // Recursively sort the right part
        quickSort(arr, index, high);
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        cout << arr[i] << " ";
    cout << endl;
}

int main() {
    int n;
    cout << "Enter the number of elements: ";
    cin >> n;

    int arr[n];

    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++)
        cin >> arr[i];

    cout << "Original array: ";
    printArray(arr, n);

    quickSort(arr, 0, n - 1);

    cout << "Sorted array: ";
    printArray(arr, n);

    return 0;
}
