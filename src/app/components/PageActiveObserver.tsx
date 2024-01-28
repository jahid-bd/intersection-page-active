'use client';
import { useEffect, useRef, useState } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

const data = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1551894116-15e3812343f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGE0JTIwcGFwZXJ8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGE0JTIwcGFwZXJ8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1615800098746-73af8261e3df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGE0JTIwcGFwZXJ8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1598124145867-c06ac60b5def?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGE0JTIwcGFwZXJ8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '5',
    image:
      'https://images.unsplash.com/photo-1592781959802-0ccb435205a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGE0JTIwcGFwZXJ8ZW58MHx8MHx8fDA%3D',
  },
];

const PageActiveObserver = () => {
  const containerRefs = useRef<Array<HTMLDivElement>>([]);
  const [isVisible, setIsVisible] = useState<Array<boolean>>([]);

  const callbackFunction = (entries: any, index: number) => {
    const [entry] = entries;
    setIsVisible((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = entry.isIntersecting;
      return newVisibility;
    });
  };

  console.log(containerRefs);
  console.log(isVisible);

  const options = {
    root: null,
    rootMargin: '-50%',
    threshold: 0,
  };

  useEffect(() => {
    const observers = containerRefs.current.map((_, index) => {
      const observer = new IntersectionObserver(
        (entries) => callbackFunction(entries, index),
        options
      );

      if (containerRefs.current[index])
        observer.observe(containerRefs.current[index]);

      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleClick = (index: number) => {
    if (containerRefs.current) {
      containerRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const [zoom, setZoom] = useState({
    scale: 1,
    translation: { x: 450, y: 0 },
  });

  console.log('zoom', zoom);
  const zoomIn = () => {
    console.log('zooin');
    if (zoom.scale < 2.5) {
      setZoom((prev) => ({
        ...prev,
        scale: prev.scale + 0.25,
        translation: { ...prev.translation, x: prev.translation.x - 75 },
      }));
    }
  };

  const zoomOut = () => {
    console.log('zooout');
    if (zoom.scale > 0.5)
      setZoom((prev) => ({
        ...prev,
        scale: prev.scale - 0.25,
        translation: { ...prev.translation, x: prev.translation.x + 75 },
      }));
  };

  return (
    <div>
      <div className="w-full h-20 bg-gray-500 fixed top-0 left-0 z-10 "></div>
      <div className="fixed left-0 top-0 h-screen w-28 flex flex-col border-r-[2px] border-gray-300 mt-20">
        <div className="flex flex-col items-center overflow-auto gap-5 p-5">
          {data?.map((item, index) => (
            <div
              key={item.id}
              id={item.id}
              onClick={() => handleClick(index)}
              // @ts-ignore

              className={`relative cursor-pointer p-1 border-[3px]  hover:bg-gray-300 ${
                isVisible[index] && 'border-green-500'
              }`}
            >
              <img src={item.image} alt="" className="w-full h-full " />
              <p className="text-center"> {item.id}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-10 mt-28 relative">
        <div className="text-3xl">
          <button
            onClick={zoomOut}
            className="bg-blue-500 text-white px-5 rounded-md "
          >
            -
          </button>
          <span className="mx-5">{zoom.scale * 100}%</span>
          <button
            className="bg-blue-500 text-white px-5 rounded-md "
            onClick={zoomIn}
          >
            +
          </button>
        </div>
        <div className="w-[80vw] border-gray-500 border-[2px]">
          <MapInteractionCSS
            value={zoom}
            onChange={(value: any) => setZoom({ ...value })}
            disableZoom={true}
            disablePan={true}
            minScale={0.5}
            maxScale={2.5}
          >
            {data?.map((item, index) => (
              <div
                className="border-[2px] border-gray-200 shadow-xl p-2 mb-4"
                key={item.id}
                // @ts-ignore
                ref={(el) => (containerRefs.current[index] = el)}
              >
                <img src={item.image} />
              </div>
            ))}
          </MapInteractionCSS>
        </div>
      </div>
    </div>
  );
};

export default PageActiveObserver;
