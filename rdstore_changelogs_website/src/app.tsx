// import { About } from "@/components/about";
// import { Contact } from "@/components/contact";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
// import { Hero  } from "@/components/hero";
import { Navbar } from "@/components/navbar";
// import { Story } from "@/components/story";
// import { Docs } from "@/components/docs";
const App = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />

      <main>
        {/* <Hero  /> */}
        {/* <About /> */}
        <Features />
        {/* <Docs /> */}
        {/* <Story /> */}
        {/* <Contact /> */}
      </main>

      <Footer />
    </div>
  );
};
export default App;
