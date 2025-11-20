import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-surface to-dark flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
          <div className="relative bg-gradient-to-r from-surface to-gray-800 rounded-full p-12 shadow-2xl">
            <ApperIcon 
              name="Music" 
              className="h-20 w-20 text-primary mx-auto" 
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-6xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-display font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The page you're looking for seems to have gone off the wavelength. 
              Let's get you back to the music.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              icon="Home"
              className="bg-gradient-to-r from-primary to-secondary px-8 py-4"
            >
              Go Home
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              icon="ArrowLeft"
              className="px-8 py-4"
            >
              Go Back
            </Button>
          </div>
          
          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-700/50">
            <p className="text-gray-500 mb-4">Or explore these sections:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/search")}
                icon="Search"
                className="text-gray-400 hover:text-white"
              >
                Search
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/library")}
                icon="Library"
                className="text-gray-400 hover:text-white"
              >
                Library
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/playlists")}
                icon="ListMusic"
                className="text-gray-400 hover:text-white"
              >
                Playlists
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;