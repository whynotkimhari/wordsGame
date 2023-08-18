import json

def convert():
    dictionary = {
        'a': [],
        'b': [],
        'c': [],
        'd': [],
        'e': [],
        'f': [],
        'g': [],
        'h': [],
        'i': [],
        'j': [],
        'k': [],
        'l': [],
        'm': [],
        'n': [],
        'o': [],
        'p': [],
        'q': [],
        'r': [],
        's': [],
        't': [],
        'u': [],
        'v': [],
        'w': [],
        'x': [],
        'y': [],
        'z': [],
    }
    with open("wordsgame/wordsGame/words.txt", 'r') as file:
        array = []
        for word in file.readlines():
            if(len(word.strip().split(" ")) == 1):
                array.append(word.strip().lower())
            else:
                continue
    
    for word in array:
        print(word)
        dictionary[word[0]].append(word)
    
    with open("wordsgame/wordsGame/words.json", "w") as outfile:
        json.dump(dictionary, outfile)

def main():
    convert()

if __name__ == "__main__":
    main()