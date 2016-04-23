import React from 'react';

const MainLayout = ({content, header}) => (
  <div>
    <header>
      {header}
    </header>
    <main>
      {content}
    </main>
  </div>
);

export default MainLayout;