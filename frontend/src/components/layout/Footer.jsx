import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 text-white bg-gray-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div><img
    src="/logo.png"
    alt="Laptop Wizard Logo"
    className="object-contain w-12 h-12"
  />
            <h3 className="mb-4 text-xl font-bold">Laptop Wizard</h3>
            <p className="text-gray-400">
              Your trusted destination for laptops and accessories. Best prices, genuine products.
            </p>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="mb-4 font-semibold">Customer Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white">Returns & Exchanges</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="mb-4 font-semibold">Policies</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white">Warranty</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="mb-4 font-semibold">Connect With Us</h4>
            <div className="flex mb-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p>Email: support@Laptop Wizard.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center text-gray-400 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} Laptop Wizard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;