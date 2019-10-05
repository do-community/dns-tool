// AppendStrings
#include <iostream>
using namespace std;

int length(char *ch){
	int i;
	for(i=0;ch[i]!='\0';i++){

	}
	return i;
}

void append(char *a,char *b){

	int l1=length(a);
	int l2=length(b);

	int i=l1;
	int j=0;
	while(j<=l2){
		a[i]=b[j];
		i++;
		j++;
	}

}

int main(){
	char a[100];
	char b[100];
	cin.getline(a,100);
	cin.getline(b,100);

	cout<<a<<endl;
	append(a,b);
	cout<<a<<endl;
	return 0;
}
