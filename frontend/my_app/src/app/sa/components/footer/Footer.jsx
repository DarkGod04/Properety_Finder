import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='bg-slate-900 text-slate-300'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>

          {/* Brand */}
          <div>
            <div className='mb-4'>
              <Image
                src="/logo-en.svg"
                alt="Property Finder Logo"
                width={140}
                height={140}
                className="brightness-0 invert"
              />
            </div>
            <p className='text-sm text-slate-400 leading-relaxed'>
              Your trusted platform for finding residential and commercial properties across Saudi Arabia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href="/" className='text-sm hover:text-white transition-colors'>Home</Link>
              </li>
              <li>
                <Link href="/sa/residential-properties-for-sale" className='text-sm hover:text-white transition-colors'>Residential for Sale</Link>
              </li>
              <li>
                <Link href="/sa/residential-properties-for-rent" className='text-sm hover:text-white transition-colors'>Residential for Rent</Link>
              </li>
              <li>
                <Link href="/sa/commercial-properties-for-sale" className='text-sm hover:text-white transition-colors'>Commercial for Sale</Link>
              </li>
              <li>
                <Link href="/sa/commercial-properties-for-rent" className='text-sm hover:text-white transition-colors'>Commercial for Rent</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <Link href="/sa/about" className='text-sm hover:text-white transition-colors'>About Us</Link>
              </li>
              <li>
                <Link href="/sa/newProjects" className='text-sm hover:text-white transition-colors'>New Projects</Link>
              </li>
              <li>
                <Link href="/sa/findAgent" className='text-sm hover:text-white transition-colors'>Find Agent</Link>
              </li>
              <li>
                <Link href="/sa/inbox" className='text-sm hover:text-white transition-colors'>Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link href="/sa/about?section=terms" className='text-sm hover:text-white transition-colors'>Terms of Service</Link>
              </li>
              <li>
                <Link href="/sa/about?section=privacy" className='text-sm hover:text-white transition-colors'>Privacy Policy</Link>
              </li>
              <li>
                <Link href="/sa/about?section=refund" className='text-sm hover:text-white transition-colors'>Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-slate-400'>
            © {new Date().getFullYear()} Property Finder. All rights reserved.
          </p>
          <div className='flex gap-4'>
            <Link href="/sa/about" className='text-sm text-slate-400 hover:text-white transition-colors'>
              About Us
            </Link>
            <Link href="/sa/about?section=contact" className='text-sm text-slate-400 hover:text-white transition-colors'>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
