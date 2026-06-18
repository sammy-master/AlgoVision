#include <iostream>

using namespace std;

int binsearch(int arr[] , int l , int h , int x)
{
    while (l<=h) 
    {
        int mid = (l+h)/2;
        if(arr[mid] == x)
          return mid;
        if(arr[mid] < x)
          return binsearch(arr,mid+1,h,x);
        else return binsearch(arr,l,mid-1,x);
    }
    return -1;
}

int main()
{
    int x,n;
    int arr[10];
    
    cout << "Enter No. of Elements for the array : " << endl;
    cin >> n;
    
    for(int i = 0 ; i<n ; i++)
    
    {
        cout << "Enter element of array : " << endl ;
        cin >> arr[i];
    }
     cout << "Your array is :- " << endl ;
    for (int i = 0 ; i<n ; i++)
    {
        cout << arr[i] << "  ";
    }
    
    cout << endl ;
    
    cout << "Enter a Key To be found : " << endl ;
    cin >> x ;
    
    n = sizeof(arr)/sizeof(arr[0]);
    int result = binsearch(arr,0,n-1,x);
    if(result == -1) cout << "Element is not present in array" << endl ;
    else cout << "Element is Present at index : " << result << endl;
    return 0;
}
