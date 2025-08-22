

import { Disclosure } from '@headlessui/react';
import { BellIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import axios from 'axios';
import { getUserData, getLoggedIn } from '../services/authService';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

function getNavigation(role, loggedIn) {
  if (!loggedIn) {
    return [
      { name: 'Home', href: '/', current: true },
      { name: 'Login', href: '/login', current: false },
      { name: 'Sign up', href: '/register', current: false },
      { name: 'About', href: '/about', current: false },
    ];
  }
  const nav = [
    { name: 'Dashboard', href: '/dashboard', current: true },
    { name: 'Events', href: '/event', current: false },
    { name: 'Meetings', href: '/meeting', current: false },
    { name: 'Bulk Upload', href: '/bulkupload', current: false },
  ];
  if (role === 'admin') {
    nav.push({ name: 'User Approval', href: '/user-approval', current: false });
  }
  nav.push({ name: 'About', href: '/about', current: false });
  return nav;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const dispatch = useDispatch();
  const user = getUserData();
  const loggedIn = getLoggedIn();
  const navigation = getNavigation(user?.role, loggedIn);
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    } catch (e) {}
    dispatch(logout());
    window.location.href = '/login';
  };
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    {/* Your company logo */}
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-gray-300 hover:bg-indigo-500 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                      {loggedIn && (
                        <>
                          <span className="flex items-center ml-4 text-white">
                            <UserCircleIcon className="h-6 w-6 mr-1 text-indigo-300" />
                            {user?.firstName || user?.adminName || user?.email}
                          </span>
                          <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium ml-2 transition-colors duration-200 hover:bg-red-700">Logout</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Notification button */}
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default Navbar;
