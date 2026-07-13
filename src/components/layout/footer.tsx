import Container from "../common/container";

const Footer = () => {
  return (
    <Container as="footer" className="py-step-400 space-y-1 text-center">
      <p className="preset-5 text-neutral-200">
        Challenge by{" "}
        <a
          href="https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary preset-5-med underline underline-offset-2 hover:text-primary"
        >
          Frontend Mentor
        </a>
      </p>

      <p className="preset-5 text-neutral-200">
        Built with{" "}
        <span aria-hidden="true" className="text-primary">
          ♥
        </span>{" "}
        by{" "}
        <a
          href="https://terminal-portfolio-website-xi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary preset-5-med underline underline-offset-2 hover:text-primary"
        >
          Souleymane Sy
        </a>
      </p>
    </Container>
  );
};

export default Footer;
