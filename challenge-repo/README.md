# QB Coding Challenge

Welcome to the QuickButik coding challenge! This is a test of your ability to work with modern web technologies, including React, Next.js, Node.js, and Docker. You'll be building upon an existing codebase that demonstrates a product listing application.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed on your machine
- Git for version control
- A modern web browser

### Getting Started

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd qb-challenge
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)
   - MySQL Database: localhost:3306

4. **Navigate to the challenge**:
   - Visit [http://localhost:3000/challenge](http://localhost:3000/challenge) to see the current product grid implementation

## 📋 Current State

### Backend (`/backend`)
The backend is a **Node.js/Express** application that provides a REST API for products. Currently, it's in a basic state with room for improvement:

**What's implemented:**
- Basic Express server with MySQL database connection
- `/products` endpoint with pagination support
- `/health` endpoint for monitoring
- Docker configuration for easy deployment

**Areas for improvement (hints for candidates):**
- **Code organization**: All code is currently in a single `index.ts` file
- **Error handling**: Basic error handling could be more robust
- **API structure**: Consider implementing proper routing, middleware, and controllers
- **Database layer**: Could benefit from a proper ORM or query builder
- **Validation**: Input validation and sanitization could be enhanced
- **Documentation**: API documentation would be helpful
- **Testing**: No tests are currently implemented

### Frontend (`/frontend`)
The frontend is a **Next.js 14** application with React 19:

**What's implemented:**
- Basic product grid component (`ProductGrid.tsx`)
- API route to proxy backend requests (`/api/products`)
- Docker configuration
- Tailwind CSS for styling
- TypeScript support

**Current challenge**: The product grid shows a basic list of products but needs enhancement for infinite scrolling.

## 🎯 Your Challenge: Infinite Scroll Implementation

### Primary Task
Implement **infinite scrolling** for the product grid in the frontend application. Currently, the grid shows only the first page of products. You need to:

1. **Load more products** as the user scrolls down
2. **Handle loading states** appropriately
3. **Manage the product list** efficiently (append new products to existing ones)
4. **Provide smooth user experience** with proper error handling

### Technical Requirements

#### Backend Considerations
The backend already provides pagination support via query parameters:
- `page`: Page number (starts from 1)
- `limit`: Number of items per page (default: 10)

Response format:
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Frontend Implementation
You'll need to modify the `ProductGrid` component to:
- Track the current page and loading state
- Implement scroll detection (consider using `IntersectionObserver` or scroll events)
- Append new products to the existing list
- Handle edge cases (no more products, errors, etc.)

### Bonus Challenges (Optional)
If you want to go above and beyond:

1. **Backend improvements**: Refactor the backend code into a more maintainable structure
2. **Enhanced UI**: Improve the product grid design with better styling and animations
3. **Search/filtering**: Add product search or category filtering
4. **Performance**: Implement virtual scrolling for large datasets

## 🛠 Development Tips

### Working with Docker
- The application uses Docker Compose for easy development
- Changes to your code will be reflected automatically (hot reload)
- If you need to restart services: `docker-compose restart <service-name>`

### Database
- MySQL database is pre-populated with sample products
- Database data persists between container restarts
- You can connect to the database directly if needed for debugging

### API Testing
You can test the backend API directly:
```bash
curl "http://localhost:3001/products?page=1&limit=5"
```

### Frontend Development
- The frontend uses Next.js with TypeScript
- Styling is done with Tailwind CSS
- Components are in `/frontend/src/components/`
- API routes are in `/frontend/src/app/api/`

## 📝 Evaluation Criteria

Your solution will be evaluated based on:

1. **Functionality**: Does the infinite scroll work correctly?
2. **Code Quality**: Clean, readable, and maintainable code
3. **User Experience**: Smooth scrolling, proper loading states, error handling
4. **Performance**: Efficient data loading and rendering
5. **Best Practices**: Following React/Next.js conventions
6. **Documentation**: Clear comments and README updates

## 🎉 Getting Help

- **AI assistance is allowed** - Feel free to use ChatGPT, GitHub Copilot, or similar tools. But make sure you understand the code
- **Documentation**: Check the [Next.js](https://nextjs.org/docs) and [React](https://react.dev) documentation
- **Questions**: If you have technical questions, document them in your solution

## 🚀 Submission

When you're ready to submit:
1. Push your code to a public GitHub repository
2. Ensure the application runs correctly with `docker-compose up`
3. Update this README with any additional setup instructions
4. Share the repository URL with us

**Good luck! We're excited to see what you build! 🚀**

---

*This challenge is designed to evaluate your practical skills with modern web technologies. Focus on creating a working solution that demonstrates your understanding of React, state management, and API integration.*
