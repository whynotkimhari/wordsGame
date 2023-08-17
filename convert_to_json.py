import json

def convert():
    dictionary = {}
    with open("wordsgame/oxford3000.txt", 'r') as file:
        array = []
        for word in file.readlines():
            if(len(word.strip().split(" ")) == 1):
                array.append(word.strip())
            else:
                continue
    
    for word in array:
        print(word)
        for copy_word in array:
            if(word != copy_word and word[-1] == copy_word[0]):
                if(word in dictionary):
                    dictionary[word].append(copy_word)
                else:
                    dictionary[word] = [copy_word]
    
    with open("wordsgame/words-3000.json", "w") as outfile:
        json.dump(dictionary, outfile)

def main():
    convert()

if __name__ == "__main__":
    main()