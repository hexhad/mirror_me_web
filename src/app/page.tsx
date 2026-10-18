import { AppleLogo, ArrowsOutCardinal, TerminalWindow } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { HeroDemo } from "@/components/HeroDemo";
import { LiquidGlass } from "@/components/LiquidGlass";
import { Reveal } from "@/components/Reveal";
import { DownloadGradient, LiquidMark } from "@/components/Visuals";
import { CopyCommand } from "@/components/CopyCommand";
import { MadeByHexhad } from "@/components/Hexhad";
import { quarantineCommand, release } from "@/lib/site";

/** The one download action on the page; every "Download" button uses this. */
function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={release.dmg}
      className={`press btn-primary inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[15px] font-semibold ${className}`}
    >
      <AppleLogo size={18} weight="fill" />
      Download for Mac
    </a>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <LiquidGlass className="flex w-full max-w-3xl items-center justify-between gap-4 py-2 pl-4 pr-2">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Image src="/app-icon.png" alt="" width={28} height={28} priority />
          MirrorMe
        </a>
        <nav className="flex items-center gap-1 text-sm text-white/70">
          <a href="#how" className="press hidden rounded-full px-3 py-2 hover:text-white sm:block">
            How it works
          </a>
          <a href="#install" className="press hidden rounded-full px-3 py-2 hover:text-white sm:block">
            Install
          </a>
          <a
            href={release.dmg}
            className="press btn-primary ml-1 hidden items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 font-semibold sm:inline-flex"
          >
            <AppleLogo size={16} weight="fill" />
            Download for Mac
          </a>
        </nav>
      </LiquidGlass>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate">
      <div className="hero-glow" />
      <div className="mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-24">
        <Reveal>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tighter md:text-5xl xl:text-[3.4rem]">
            A camera for simulators.
            <span className="block text-[var(--muted)]">Aimed at your desktop.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[var(--muted)]">
            MirrorMe lets iOS Simulators and Android emulators see whatever sits beneath their window. Drag it over a
            QR code.
          </p>
          <div className="mt-9">
            <DownloadButton />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <HeroDemo />
        </Reveal>
      </div>
    </section>
  );
}

function Platforms() {
  return (
    <section id="how" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="max-w-[18ch] text-3xl font-semibold tracking-tighter md:text-5xl">One switch. Every simulator and emulator.</h2>
        <p className="mt-5 max-w-[60ch] text-[var(--muted)] leading-relaxed">
          No changes to the app you are testing. MirrorMe plugs into the camera APIs the app already uses.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Reveal className="panel flex flex-col md:col-span-3 md:row-span-2">
          <div className="p-7 pb-0">
            <h3 className="text-xl font-semibold tracking-tight">iOS Simulator</h3>
            <p className="mt-2 max-w-[44ch] text-[var(--muted)]">
              Preview, video frames, photos and QR scanning work in any app that uses AVFoundation.
            </p>
          </div>
          <div className="relative mt-7 flex flex-1 justify-center overflow-hidden bg-[radial-gradient(80%_60%_at_50%_100%,rgb(52_211_153/0.18),transparent)] px-10 pt-2">
            <Image
              src="/shots/ios.jpg"
              alt="An iOS Simulator app scanning a QR code through MirrorMe"
              width={506}
              height={1100}
              className="shot-fade h-auto w-[62%] max-w-[300px] rounded-t-[28px]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.06} className="panel flex flex-col md:col-span-3 md:row-span-2">
          <div className="p-7 pb-0">
            <h3 className="text-xl font-semibold tracking-tight">Android emulator</h3>
            <p className="mt-2 max-w-[44ch] text-[var(--muted)]">
              Emulators started from MirrorMe get a MirrorMe Camera that fills the camera preview edge to edge.
            </p>
          </div>
          <div className="relative mt-7 flex flex-1 justify-center overflow-hidden bg-[linear-gradient(to_bottom,transparent,rgb(255_255_255/0.03))] px-10 pt-2">
            <Image
              src="/shots/android.jpg"
              alt="The Android emulator camera showing the MirrorMe test pattern"
              width={493}
              height={1100}
              className="shot-fade h-auto w-[62%] max-w-[300px] rounded-t-[28px]"
            />
          </div>
        </Reveal>

        <Reveal className="panel bg-[linear-gradient(140deg,rgb(52_211_153/0.16),transparent_60%)] p-7 md:col-span-2">
          <ArrowsOutCardinal size={26} className="text-[var(--accent)]" />
          <h3 className="mt-5 text-lg font-semibold tracking-tight">It follows the window</h3>
          <p className="mt-2 text-[var(--muted)]">Drag a simulator across your screen and its camera keeps up, showing what is underneath, live.</p>
        </Reveal>

        <Reveal delay={0.05} className="panel flex items-center gap-5 p-7 md:col-span-2">
          <Image src="/app-icon.png" alt="" width={72} height={72} className="shrink-0" />
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Lives in the menu bar</h3>
            <p className="mt-2 text-[var(--muted)]">Turn every device camera on or off with one switch.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="panel p-7 md:col-span-2">
          <TerminalWindow size={26} className="text-[var(--accent)]" />
          <h3 className="mt-5 text-lg font-semibold tracking-tight">Scriptable</h3>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/30 p-3 font-mono text-[13px] leading-relaxed text-white/80">
            {`mirrorme app enable
mirrorme ios launch com.you.app
mirrorme android launch Pixel_8`}
          </pre>
        </Reveal>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section id="install" className="scroll-mt-24 mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tighter md:text-5xl">Installed in a minute.</h2>
      </Reveal>
      <ol className="mt-12 grid gap-10">
        <Reveal>
          <Step n={1} title="Download and drag into Applications">
            Open the disk image and drag MirrorMe onto the Applications folder.
          </Step>
        </Reveal>
        <Reveal delay={0.05}>
          <Step n={2} title="Run this once in Terminal">
            MirrorMe isn&apos;t notarized by Apple, so macOS holds it back the first time. This lets it open.
            <div className="mt-4">
              <CopyCommand command={quarantineCommand} />
            </div>
          </Step>
        </Reveal>
        <Reveal delay={0.1}>
          <Step n={3} title="Turn it on">
            Click the menu bar icon, flip the switch and allow Screen Recording. Then relaunch the app you are testing.
          </Step>
        </Reveal>
      </ol>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr] gap-4">
      <span className="flex size-9 items-center justify-center rounded-full bg-white/5 font-mono text-sm text-[var(--accent)] shadow-[inset_0_0_0_1px_var(--line)]">
        {n}
      </span>
      <div className="min-w-0">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <div className="mt-1.5 leading-relaxed text-[var(--muted)]">{children}</div>
      </div>
    </li>
  );
}

function Download() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[var(--radius-panel)] shadow-[inset_0_0_0_1px_var(--line)]">
        <DownloadGradient />
        <div className="relative z-10 grid items-center gap-10 px-6 py-16 md:grid-cols-[auto_1fr] md:px-14 md:py-20">
          <div className="mx-auto">
            <LiquidMark size={260} />
          </div>
          <div>
            <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tighter md:text-5xl">Give your simulators a view.</h2>
            <p className="mt-4 max-w-[52ch] leading-relaxed text-white/75">
              Free for macOS. Works with the iOS Simulator from Xcode and the Android Emulator from the Android SDK.
            </p>
            <div className="mt-8">
              <DownloadButton />
            </div>
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-white/50">Version</dt>
                <dd className="mt-0.5 font-mono">{release.version}</dd>
              </div>
              <div>
                <dt className="text-white/50">Requires</dt>
                <dd className="mt-0.5">{release.minOS} or later</dd>
              </div>
              <div>
                <dt className="text-white/50">Size</dt>
                <dd className="mt-0.5">{release.size}</dd>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <dt className="text-white/50">SHA-256</dt>
                <dd className="mt-0.5 break-all font-mono text-xs text-white/70">{release.sha256}</dd>
              </div>
            </dl>
            <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-white/70">
              <span className="font-medium text-white/90">New in {release.version}.</span> {release.notes}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[var(--line)] px-4 py-10 text-sm text-[var(--muted)] sm:flex-row sm:px-6">
      <div className="flex items-center gap-2.5">
        <Image src="/app-icon.png" alt="" width={22} height={22} />
        <span>MirrorMe for macOS</span>
        <MadeByHexhad />
      </div>
      <div className="flex items-center gap-6">
        <span>© {new Date().getFullYear()} HEXHAD</span>
        <a href="#top" className="hover:text-white">
          Back to top
        </a>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Platforms />
        <Install />
        <Download />
      </main>
      <Footer />
    </>
  );
}
