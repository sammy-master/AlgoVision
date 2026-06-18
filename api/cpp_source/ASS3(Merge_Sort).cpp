#include <iostream>
using namespace std;
void merge(int a[],int l,int m,int h){
    int i,j,k,n1,n2;
    n1 = m-l+1;
    n2 = h-m;
    int la[n1];
    int ra[n2];
    for (int i = 0; i < n1; i++) {
        la[i]=a[l+i];
    }
    for (int i = 0; i < n2; i++) {
        ra[i] = a[m+i+1];
    }
    i = 0;
    j = 0;
    k = l;
    while(i<n1 && j < n2){
        if(la[i]<ra[j]){
            a[k++] = la[i++];
        }
        else{
            a[k++] = ra[j++];
        }
    }
    
    while(i<n1){
        a[k++] = la[i++];
    }
    while(j<n2){
        a[k++] = ra[j++];
    }
}
void mergesort(int arr[],int l,int h){
    if(l<h){
        int m = l+(h-l)/2;
        mergesort(arr,l,m);
        mergesort(arr,m+1,h);
        merge(arr,l,m,h);
    }
}
int main()
{
    int n;
    
    cout << "Enter Number of Elements in an array : ";
    cin >> n;
    int a[n];
    cout<<"Enter " << n << " Elements : ";
    
    for (int i = 0 ; i<n ; i++){
        cin >> a[i];
    }
    
    mergesort(a,0,n-1);
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
    
    
    return 0;
}
