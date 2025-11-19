import Link from 'next/link'

export default function Home() {
  return (
    <div className="prose-sm prose-a:text-blurple prose-ul:list-disc">
      <h1>QB Coding Challenge</h1>

      <h2>Welcome!</h2>
      <p>
        This challenge tests your ability to work with modern web technologies including React, Next.js, Node.js, and Docker. 
        You'll be building upon an existing codebase to implement infinite scrolling for a product grid.
      </p>

      <h2>What You'll Build</h2>
      <p>
        The main challenge is to implement <strong>infinite scrolling</strong> for the product grid. 
        Currently, the grid shows only the first page of products. You need to:
      </p>

      <ul>
        <li>Load more products as the user scrolls down</li>
        <li>Handle loading states appropriately</li>
        <li>Manage the product list efficiently</li>
        <li>Provide smooth user experience with proper error handling</li>
      </ul>

      <h2>Getting Started</h2>
      <p>
        Make sure you've read the <strong>README.md</strong> in the root directory for detailed setup instructions, 
        technical requirements, and evaluation criteria.
      </p>

      <p>
        Click the link below to see the current product grid implementation:
      </p>

      <ol className="list-decimal">
        <li>
          <Link href="/challenge">Product Grid Challenge</Link>
        </li>
      </ol>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-blue-900 dark:text-blue-100 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200">
          <li>The backend already provides pagination support via query parameters</li>
          <li>Focus on clean, maintainable code and smooth user experience</li>
          <li>AI assistance is allowed - just make sure you understand the code</li>
        </ul>
      </div>
    </div>
  )
}
