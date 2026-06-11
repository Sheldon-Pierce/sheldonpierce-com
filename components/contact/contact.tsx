import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { FooterContent } from "@/components/footer/footer";

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <FadeUpOnScroll>
          <div className="stratum-label">
            <span className="depth">— 200 m · bedrock</span> Contact
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll>
          <h2>
            Let&apos;s <em>talk.</em>
          </h2>
        </FadeUpOnScroll>

        <FadeUpOnScroll>
          <p className="lede">
            For freelance work, collaborations, or anything you want to make
            together — drop me a line.
          </p>
        </FadeUpOnScroll>

        <FadeUpOnScroll>
          <a className="email-link" href="mailto:pierce55@icloud.com">
            pierce55@icloud.com
          </a>
        </FadeUpOnScroll>

        <FadeUpOnScroll>
          <div className="socials">
            <a
              href="https://github.com/Sheldon-Pierce"
              target="_blank"
              rel="noopener"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/sheldon-pierce/"
              target="_blank"
              rel="noopener"
            >
              LinkedIn ↗
            </a>
          </div>
        </FadeUpOnScroll>

        <FooterContent />
      </div>
    </section>
  );
}
