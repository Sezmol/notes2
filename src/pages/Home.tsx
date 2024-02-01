import Header from '../components/Header';
import ListContent from '../components/ListContent';
import ListsMenu from '../components/ListsMenu';

function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <ListsMenu />
        <ListContent />
      </div>
    </div>
  );
}

export default Home;
