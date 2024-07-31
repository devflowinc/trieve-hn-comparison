# Hacker News Search Engine Comparison

This project is a web application that compares search results from two different search engines (Trieve and Algolia) for Hacker News content. Users can perform searches, view results side by side, and log their preferences between the two search engines.

## Features

- Dual search engine comparison (Trieve vs Algolia)
- Side-by-side result display
- User preference logging to PostgreSQL database
- Server Actions for backend operations
- Responsive design

## Technologies Used

- Next.js 13+
- React
- TypeScript
- PostgreSQL
- TanStack Query (React Query)
- Tailwind CSS
- Zod for validation

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/hn-search-comparison.git
   cd hn-search-comparison
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your environment variables by creating a `.env.local` file in the root directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
   ```

4. Set up your PostgreSQL database and create the necessary table:
   ```sql
   CREATE TABLE search_preferences (
     id SERIAL PRIMARY KEY,
     winner VARCHAR(10) NOT NULL,
     query TEXT NOT NULL,
     ip VARCHAR(45) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Usage

To run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
hn-search-comparison/
│
├── app/
│   ├── actions.ts
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── search-comparison-form.tsx
│
├── lib/
│   └── db.ts
│
├── public/
│
├── .env.local
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
