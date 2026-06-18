#include <iostream>
#include <conio.h>

using namespace std;

int main()
{
    int i , x , n ;
    int arr[10];
    int f = 0 ;
    cout << "Enter Number of Elements in Array : " << endl ;
    cin >> n ;
    
    for (int i = 0 ; i<n ; i++){
        cout << "Enter Elements of array : " ;
        cin >> arr[i];
    }
    
    for (int i = 0 ; i<n ; i++){
        cout << arr[i] << "  ";
    }
    
    cout << endl << "Enter Element To Find : " << endl;
    cin >> x;
        for (int i = 0 ; i<n ; i++){
        if(arr[i]==x){
            cout << " Element is Present at : " << i << endl;
            f = 1;
            break;
            
        }
    }
    
    if (f == 0){
        cout << "Element Not Found." << endl ;
    }
    return 0;
}