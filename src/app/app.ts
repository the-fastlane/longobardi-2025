import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<header>
      <nav class="s-container">
        <a
          href=""
          class="logo-link">
          <img
            src="logo-van-dyke-mortgage.png"
            alt="Van Dyke Mortgage - Joseph Longobardi"
            class="logo" />
        </a>
      </nav>
    </header>

    <router-outlet></router-outlet>

    <section class="stats">
      <div class="s-container">
        <div>Direct mortgage lender <span>offering FHA, VA, USDA, Conventional, Jumbo, DSCR/Investor and bank statement loans</span></div>
        <div class="line">3-time<span>President's Club winner</span></div>
        <div>
          5.0 star reviews<span
            ><a
              href="https://birdeye.com/joseph-longobardi-vandyk-mortgage-corporation-169636491452692"
              target="_blank"
              >from 336 happy clients</a
            ></span
          >
        </div>
        <div>$250 Million+<span>funded volume since 2014</span></div>
      </div>
    </section>
    <section>
      <div class="s-container">
        <div class="profile">
          <img
            src="joseph-longobardi.jpg"
            alt="Van Dyke Mortgage - Joseph Longobardi" />
          <div>
            <h3>Joseph Longobardi</h3>
            <p><b>Branch Manager | NMLS#: 399823</b></p>
            <p>
              <a
                href="https://josephlongobardi.vandykmortgage.com/"
                target="_blank"
                >VanDyk Mortgage Maryland</a
              >
            </p>
            <p>Call or Text: <a href="tel:410-960-7639">410-960-7639</a></p>
          </div>
        </div>
        <div class="about">
          <p>
            <em>I truly love helping clients and I love my job!</em> There are many lenders out there, but I strive to stand out by offering something
            that can’t be replicated: <b>authentic, personalized care</b>. I treat every client and realtor partner like family, providing exceptional
            service and unwavering attention from the first conversation to the final closing.
          </p>
          <p>That means:</p>
          <ul>
            <li>Being available 9am-9pm 7 days a week via email, text and phone.</li>
            <li>Avoiding future hurdles by not waiting to the last minute to cover a possible issue.</li>
            <li>Being proactive with your loan process so it is smooth and stress-free.</li>
          </ul>

          <p>
            I’m proud to be a Maryland native, raised in Northern Baltimore County, and a graduate of Towson University with a degree in Business
            Administration with a focus in Finance. Today, I’ve returned to my roots and live nearby with my amazing wife, our two wonderful kids, and
            our dog. Helping families find home here is more than just a job—it’s deeply personal.
          </p>
        </div>
      </div>
    </section>
    <footer>
      <div class="s-container">
        <img
          src="cert-mba.png"
          alt="Mortgage Bankers Association" />
        <img
          src="cert-30years.png"
          alt="30 Years in Business" />
        <div class="copyright">
          <p>Copyright &copy; {{ currentYear }} Joseph Longobardi, VanDyk Mortgage Maryland, NMLS#: 399823</p>
          <p>
            Mortgage Loan Disclosure: Obtaining a mortgage loan involves various fees that can differ depending on factors like loan amount, credit
            score, and property location. These fees may include, but are not limited to, origination charges, appraisal costs, title insurance, and
            recording fees.
          </p>
        </div>
      </div>
    </footer>`,
})
export class App {
  protected title = 'longobardi';
  protected currentYear = new Date().getFullYear();
}
