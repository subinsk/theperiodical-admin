export function Footer(): JSX.Element {
  return (
    <div className="z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-[20px] pb-4 lg:mb-6 lg:max-w-[100%] lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6">
      <p className="mb-6 text-center text-sm text-gray-600 md:text-base lg:mb-0">
        ©{new Date().getFullYear()} The Periodical. All Rights Reserved.
      </p>
      <ul className="flex flex-wrap items-center sm:flex-nowrap">
        <li className="mr-12">
          <a
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
            href="mailto:hello@simmmple.com"
            target="blank"
          >
            Support
          </a>
        </li>
        <li className="mr-12">
          <a
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
            href="https://simmmple.com/licenses"
            target="blank"
          >
            License
          </a>
        </li>
        <li className="mr-12">
          <a
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
            href="https://simmmple.com/terms-of-service"
            target="blank"
          >
            Terms of Use
          </a>
        </li>
        <li>
          <a
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
            href="https://blog.horizon-ui.com/"
            target="blank"
          >
            Blog
          </a>
        </li>
      </ul>
    </div>
  );
}
