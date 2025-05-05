
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-realestate-primary">
            Ahmedabad Real Estate Vista
          </h1>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-sm mx-auto lg:max-w-md ml-8">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="w-full pl-8 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">Properties</Button>
          <Button variant="ghost">Analytics</Button>
          <Button variant="default" className="bg-realestate-primary">Login</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
