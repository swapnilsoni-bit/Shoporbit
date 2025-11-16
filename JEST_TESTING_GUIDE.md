# 🧪 Jest Testing Guide

## What is Jest?

**Jest** is a JavaScript testing framework created by Facebook. It's the most popular testing tool for React and Next.js applications.

Think of Jest as a **quality control system** for your code:
- ✅ **Automatically tests** your code to make sure it works
- ✅ **Catches bugs** before users find them
- ✅ **Prevents regressions** (when new code breaks old features)
- ✅ **Gives confidence** to make changes without fear

---

## 🎯 Why is Testing Important?

### Real-World Analogy

Imagine building a car:
- **Without tests:** You build it, hope it works, and find out on the road if something breaks
- **With tests:** You test each part (engine, brakes, lights) before assembly, ensuring everything works

### Benefits

1. **Catch Bugs Early** - Find problems before users do
2. **Confidence** - Make changes knowing tests will catch mistakes
3. **Documentation** - Tests show how code should work
4. **Refactoring Safety** - Change code structure without breaking functionality
5. **Team Collaboration** - Everyone knows what the code should do

---

## 🚀 How to Use Jest

### Step 1: Run All Tests

```bash
npm test
```

This will:
- Find all test files (`*.test.ts`, `*.test.tsx`, `*.spec.ts`)
- Run all tests
- Show results in terminal

### Step 2: Watch Mode (Recommended for Development)

```bash
npm run test:watch
```

This will:
- Run tests automatically when you change files
- Only run tests for changed files (faster)
- Keep running until you stop it (Ctrl+C)

### Step 3: Coverage Report

```bash
npm run test:coverage
```

This will:
- Run all tests
- Generate a coverage report
- Show which code is tested and which isn't
- Create HTML report in `coverage/` folder

---

## 📁 Your Current Setup

### Configuration Files

1. **`jest.config.js`** - Main Jest configuration
2. **`jest.setup.js`** - Setup file (runs before each test)
3. **`__tests__/`** - Folder for test files

### Test File Location

Tests can be in two places:
- **`__tests__/` folder** - Dedicated test folder
- **Next to source files** - `Component.test.tsx` next to `Component.tsx`

---

## 📝 Writing Your First Test

### Example: Testing a Simple Function

Let's say you have a utility function:

```typescript
// lib/utils/calculations.ts
export function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

**Test file:**

```typescript
// lib/utils/calculations.test.ts
import { calculateTotal } from './calculations';

describe('calculateTotal', () => {
  it('should multiply price by quantity', () => {
    expect(calculateTotal(10, 3)).toBe(30);
  });

  it('should handle zero quantity', () => {
    expect(calculateTotal(10, 0)).toBe(0);
  });

  it('should handle decimal prices', () => {
    expect(calculateTotal(9.99, 2)).toBe(19.98);
  });
});
```

**Run the test:**
```bash
npm test
```

**Output:**
```
✓ calculateTotal should multiply price by quantity
✓ calculateTotal should handle zero quantity
✓ calculateTotal should handle decimal prices

3 passed
```

---

## 🧩 Testing React Components

### Example: Testing a Button Component

**Component:**
```typescript
// components/Button.tsx
'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

**Test file:**
```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders the label correctly', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn(); // Mock function
    render(<Button label="Click Me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click Me" onClick={() => {}} disabled />);
    expect(screen.getByText('Click Me')).toBeDisabled();
  });
});
```

---

## 🎓 Key Testing Concepts

### 1. **describe()** - Test Suite
Groups related tests together:

```typescript
describe('Shopping Cart', () => {
  // All cart-related tests go here
});
```

### 2. **it() or test()** - Individual Test
A single test case:

```typescript
it('should add item to cart', () => {
  // Test code here
});
```

### 3. **expect()** - Assertions
What you expect to happen:

```typescript
expect(result).toBe(5);           // Exact match
expect(result).toEqual({a: 1});   // Deep equality
expect(array).toHaveLength(3);    // Array length
expect(value).toBeTruthy();       // Truthy value
```

### 4. **Mock Functions**
Simulate functions:

```typescript
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
```

---

## 📚 Common Test Patterns

### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('handles form submission', () => {
  const handleSubmit = jest.fn();
  render(<Form onSubmit={handleSubmit} />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  // Submit
  fireEvent.click(screen.getByText('Submit'));
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com'
  });
});
```

### Testing Async Operations

```typescript
it('loads data on mount', async () => {
  render(<DataComponent />);
  
  // Wait for data to load
  expect(await screen.findByText('Data loaded')).toBeInTheDocument();
});
```

### Testing Redux/Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { useCart } from '@/lib/hooks/reduxHooks';

it('adds item to cart', () => {
  const { result } = renderHook(() => useCart());
  
  result.current.addToCart(mockProduct, 1);
  expect(result.current.cart).toHaveLength(1);
});
```

---

## 🎯 What to Test

### ✅ DO Test:

1. **Business Logic** - Calculations, validations, transformations
2. **User Interactions** - Button clicks, form submissions
3. **Component Rendering** - Does it show the right content?
4. **Edge Cases** - Empty inputs, null values, errors
5. **Critical Features** - Login, checkout, payments

### ❌ DON'T Test:

1. **Third-party libraries** - They're already tested
2. **Implementation details** - Test behavior, not how it's done
3. **Styling** - CSS is hard to test reliably
4. **Everything** - Focus on important features

---

## 📊 Understanding Test Results

### Passing Test
```
✓ should calculate total correctly (5ms)
```

### Failing Test
```
✗ should calculate total correctly (3ms)
  Expected: 30
  Received: 25
```

### Test Coverage

```
File      | % Stmts | % Branch | % Funcs | % Lines
----------|---------|----------|---------|--------
utils.ts  |   85.71 |    66.67 |   83.33 |   85.71
```

**What it means:**
- **% Stmts** - Percentage of statements executed
- **% Branch** - Percentage of if/else branches tested
- **% Funcs** - Percentage of functions tested
- **% Lines** - Percentage of lines executed

**Good coverage:** 70-80% is excellent for most projects

---

## 🛠️ Practical Examples for Your App

### Example 1: Test Cart Calculations

```typescript
// __tests__/cart.test.ts
import { calculateSubtotal } from '@/lib/utils/cart';

describe('Cart Calculations', () => {
  it('calculates subtotal correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 }
    ];
    expect(calculateSubtotal(items)).toBe(35);
  });
});
```

### Example 2: Test Product Filtering

```typescript
// __tests__/filters.test.ts
import { filterProducts } from '@/lib/utils/filterHelpers';

describe('Product Filtering', () => {
  const products = [
    { id: 1, price: 10, category: 'electronics' },
    { id: 2, price: 20, category: 'clothing' }
  ];

  it('filters by category', () => {
    const filtered = filterProducts(products, { category: 'electronics' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].category).toBe('electronics');
  });

  it('filters by price range', () => {
    const filtered = filterProducts(products, { minPrice: 15, maxPrice: 25 });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].price).toBe(20);
  });
});
```

### Example 3: Test Review Form

```typescript
// __tests__/ReviewForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewForm from '@/components/ReviewForm';

describe('ReviewForm', () => {
  it('submits review with valid data', () => {
    const onSubmit = jest.fn();
    render(<ReviewForm productId={1} onReviewSubmit={onSubmit} />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Share your experience...'), {
      target: { value: 'Great product! Highly recommend.' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Submit Review'));
    
    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows error for empty name', () => {
    render(<ReviewForm productId={1} />);
    
    fireEvent.click(screen.getByText('Submit Review'));
    
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
  });
});
```

---

## 🎨 Test Organization

### File Structure

```
project/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx        ← Test next to component
├── lib/
│   ├── utils/
│   │   ├── calculations.ts
│   │   └── calculations.test.ts
└── __tests__/
    ├── integration/
    │   └── cart-flow.test.tsx  ← Integration tests
    └── unit/
        └── helpers.test.ts      ← Unit tests
```

### Naming Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Or: `*.spec.ts` or `*.spec.tsx`
- Describe blocks: Use component/function name
- Test names: Use "should" or "it" format

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module"

**Problem:**
```
Cannot find module '@/components/Button'
```

**Solution:**
Check `jest.config.js` has path mapping:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Issue 2: "window is not defined"

**Problem:**
```
ReferenceError: window is not defined
```

**Solution:**
Add to `jest.setup.js`:
```javascript
Object.defineProperty(window, 'matchMedia', {
  // ... mock implementation
});
```

### Issue 3: "React Hook errors"

**Problem:**
```
Invalid hook call
```

**Solution:**
Make sure you're using `@testing-library/react`:
```typescript
import { render } from '@testing-library/react';
```

---

## 📈 Best Practices

### 1. **Arrange-Act-Assert (AAA) Pattern**

```typescript
it('should calculate total', () => {
  // Arrange - Set up test data
  const price = 10;
  const quantity = 3;
  
  // Act - Execute the function
  const result = calculateTotal(price, quantity);
  
  // Assert - Check the result
  expect(result).toBe(30);
});
```

### 2. **Test One Thing at a Time**

```typescript
// ❌ Bad - Tests multiple things
it('should do everything', () => {
  // Too many assertions
});

// ✅ Good - One test, one thing
it('should add item to cart', () => { /* ... */ });
it('should update quantity', () => { /* ... */ });
it('should remove item', () => { /* ... */ });
```

### 3. **Use Descriptive Test Names**

```typescript
// ❌ Bad
it('test 1', () => { /* ... */ });

// ✅ Good
it('should show error when email is invalid', () => { /* ... */ });
```

### 4. **Keep Tests Simple**

```typescript
// ❌ Bad - Too complex
it('should handle everything', () => {
  // 50 lines of setup and assertions
});

// ✅ Good - Simple and clear
it('should return true for valid email', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});
```

---

## 🎯 Testing Checklist

When writing tests, ask yourself:

- [ ] Does the test have a clear name?
- [ ] Does it test one thing?
- [ ] Does it test the important behavior?
- [ ] Can it run independently?
- [ ] Is it fast?
- [ ] Does it catch real bugs?

---

## 📚 Quick Reference

### Common Matchers

```typescript
expect(value).toBe(4);                    // Exact equality
expect(value).toEqual({a: 1});            // Deep equality
expect(value).toBeTruthy();                // Truthy
expect(value).toBeFalsy();                // Falsy
expect(value).toBeNull();                 // Null
expect(value).toBeUndefined();            // Undefined
expect(array).toHaveLength(3);            // Array length
expect(string).toContain('hello');        // String contains
expect(mockFn).toHaveBeenCalled();        // Function called
expect(mockFn).toHaveBeenCalledWith(1);   // Called with args
```

### Common Queries (React Testing Library)

```typescript
screen.getByText('Hello');              // Find by text
screen.getByRole('button');             // Find by role
screen.getByLabelText('Email');         // Find by label
screen.getByPlaceholderText('Enter');   // Find by placeholder
screen.queryByText('Hello');            // Returns null if not found
screen.findByText('Hello');             // Async - waits for element
```

---

## 🚀 Getting Started

### Step 1: Write Your First Test

Create a simple test file:

```typescript
// __tests__/example.test.ts
describe('My First Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Step 2: Run It

```bash
npm test
```

### Step 3: See It Pass!

```
✓ My First Test should pass (2ms)
```

### Step 4: Write More Tests

Start testing your actual code:
- Utility functions
- Components
- Hooks
- Business logic

---

## 💡 Pro Tips

1. **Start Small** - Test one function at a time
2. **Test Behavior** - Test what it does, not how
3. **Use Watch Mode** - `npm run test:watch` during development
4. **Check Coverage** - Aim for 70-80% coverage
5. **Write Tests First** - Sometimes helps clarify requirements

---

## ✅ Summary

**Jest helps you:**
- ✅ Catch bugs before users do
- ✅ Refactor with confidence
- ✅ Document how code works
- ✅ Prevent regressions
- ✅ Build better software

**Remember:**
- Tests are your safety net
- Good tests = Better code
- Start simple, build up
- Test what matters most

---

*Happy Testing! 🧪*

