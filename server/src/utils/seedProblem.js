import 'dotenv/config';

import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import problemModel from '../models/problem.js';

const ADMIN_USER_ID = '6abc272ee248dea9d3cf450b';

const problemData = {
  title: 'Two Sum',

  description:
      'Given an array of integers and a target integer, return the indices of two numbers such that they add up to the target.',

  difficulty: 'Easy',

  tags: ['Array'],

  visibleTestCases: [
    {
      input: '4\n2 7 11 15\n9',
      output: '0 1',
      explanation: 'The numbers 2 and 7 add up to 9.'
    },
    {
      input: '3\n3 2 4\n6',
      output: '1 2',
      explanation: 'The numbers 2 and 4 add up to 6.'
    }
  ],

  hiddenTestCases: [
    {input: '2\n3 3\n6', output: '0 1'},
    {input: '5\n1 5 3 7 9\n10', output: '0 3'}
  ],

  boilerPlate: [
    {
      language: 'C++',
      initialCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    // Write your solution here

    return 0;
}`
    },

    {
      language: 'Java',
      initialCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int[] nums = new int[n];

        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }

        int target = sc.nextInt();

        // Write your solution here
    }
}`
    },

    {
      language: 'JavaScript',
      initialCode: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8")
    .trim()
    .split(/\\s+/)
    .map(Number);

let index = 0;

const n = input[index++];
const nums = [];

for (let i = 0; i < n; i++) {
    nums.push(input[index++]);
}

const target = input[index++];

// Write your solution here
`
    },

    {
      language: 'Python',
      initialCode: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# Write your solution here
`
    }
  ],

  editorialCode: [
    {
      language: 'C++',
      completeCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    unordered_map<int, int> mp;

    for (int i = 0; i < n; i++) {
        int required = target - nums[i];

        if (mp.count(required)) {
            cout << mp[required] << " " << i;
            return 0;
        }

        mp[nums[i]] = i;
    }

    return 0;
}`
    },

    {
      language: 'Java',
      completeCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int[] nums = new int[n];

        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }

        int target = sc.nextInt();

        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < n; i++) {
            int required = target - nums[i];

            if (map.containsKey(required)) {
                System.out.println(map.get(required) + " " + i);
                return;
            }

            map.put(nums[i], i);
        }
    }
}`
    },

    {
      language: 'JavaScript',
      completeCode: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8")
    .trim()
    .split(/\\s+/)
    .map(Number);

let index = 0;

const n = input[index++];
const nums = [];

for (let i = 0; i < n; i++) {
    nums.push(input[index++]);
}

const target = input[index++];

const map = new Map();

for (let i = 0; i < n; i++) {
    const required = target - nums[i];

    if (map.has(required)) {
        console.log(map.get(required), i);
        process.exit(0);
    }

    map.set(nums[i], i);
}`
    },

    {
      language: 'Python',
      completeCode: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

seen = {}

for i in range(n):
    required = target - nums[i]

    if required in seen:
        print(seen[required], i)
        break

    seen[nums[i]] = i
`
    }
  ],

  problemCreator: ADMIN_USER_ID
};

async function seedProblem() {
  try {
    await connectDB();

    const existingProblem = await problemModel.findOne({title: 'Two Sum'});

    if (existingProblem) {
      console.log('Two Sum already exists.');
      return;
    }

    const problem = await problemModel.create(problemData);

    console.log(`Problem created successfully: ${problem.title}`);

  } catch (error) {
    console.error('Failed to seed problem:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedProblem();