/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FunnelIcon } from '@heroicons/react/16/solid';
import defaultImage from '../assets/default.jpg';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DropdownFilter({ categories, setSelectedCategory, page, setPage, fetchProducts }) {

  const handleFilter = (category) => {
    setPage(1);
    setSelectedCategory(category);
    fetchProducts(page, category);
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-dark-custom px-3 py-2 text-sm font-semibold text-light-custom shadow-sm hover:opacity-85">
          <FunnelIcon width={20} />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[170px] origin-top-right rounded-md bg-white shadow-lg focus:outline-none">
          <div className="py-1">
          <Menu.Item>
                {({ active }) => (
                  <div className='flex justify-end hover:bg-orange-950 hover:bg-opacity-5' onClick={() => { setSelectedCategory(''); handleFilter(''); }}>
                    <a
                      className={classNames('text-gray-700 block px-4 py-2 text-sm cursor-pointer'
                      )}
                    >
                      Tutti i prodotti
                    </a>
                    <a>
                      <img src={defaultImage} alt='defaul image' className='w-10 h-10 rounded-full' />
                    </a>
                  </div>
                )}
              </Menu.Item>
            {categories.map((category, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div className='flex justify-end hover:bg-orange-950 hover:bg-opacity-5' onClick={() => { setSelectedCategory(category.name); handleFilter(category.name); }}>
                    <a
                      className={classNames('text-gray-700 block px-4 py-2 text-sm cursor-pointer'
                      )}
                    >
                      {category.name}
                    </a>
                    <a>
                      <img src={category.image ? `https://api.menu.avillettapizzeria.it/storage/${category.image}` : defaultImage} alt={category.name} className='w-10 h-10 rounded-full' />
                    </a>
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
