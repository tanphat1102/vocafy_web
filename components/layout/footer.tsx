import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Image
            src="/images/logoWhite.png"
            alt="Vocafy"
            width={100}
            height={32}
            className="mx-auto mb-4"
          />
          <p className="text-gray-400">© 2026 Vocafy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
