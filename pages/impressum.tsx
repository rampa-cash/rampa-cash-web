import Head from 'next/head'
import type { NextPage } from 'next'

const Impressum: NextPage = () => {
	return (
		<>
			<Head>
				<title>Impressum - RAMPA</title>
				<meta name="description" content="Legal information and company details for RAMPA" />
			</Head>
			<div className="min-h-screen bg-gray-50 py-16">
				<div className="container mx-auto px-4 md:px-8">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Impressum</h1>
						<div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
						{/* Company Information */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Angaben gemäß § 5 TMG</h2>
							<div className="space-y-2 text-gray-700">
							<p><strong>Juan Betancur</strong></p>
							<p>Arnulfstr, 171</p>
							<p>80634 Munich</p>
							<p>Deutschland</p>
							</div>
						</section>
						{/* Contact Information */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Kontakt</h2>
							<div className="space-y-2 text-gray-700">
							<p><strong>Telefon:</strong> +49 176 71763207</p>
							<p><strong>E-Mail:</strong> team@rampa.cash</p>
							<p><strong>Website:</strong> www.rampa.cash</p>
							</div>
						</section>
						{/* Editorial Responsibility */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Redaktionell verantwortlich</h2>
							<div className="space-y-2 text-gray-700">
							<p><strong>Juan Betancur</strong></p>
							<p>Arnulfstr, 171</p>
							<p>80634 Munich</p>
							</div>
						</section>
						{/* EU Dispute Resolution */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">EU-Streitschlichtung</h2>
							<div className="space-y-2 text-gray-700">
							<p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
							<a href="https://ec.europa.eu/consumers/odr/" className="text-indigo-600 hover:text-indigo-800 underline ml-1">
								https://ec.europa.eu/consumers/odr/
							</a></p>
							<p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
							</div>
						</section>
						{/* Consumer Dispute Resolution */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
							<div className="space-y-2 text-gray-700">
							<p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
							Verbraucherschlichtungsstelle teilzunehmen.</p>
							</div>
						</section>
						{/* Liability for Content */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Haftung für Inhalte</h2>
							<div className="space-y-2 text-gray-700">
							<p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
							allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
							verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
							zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
							<p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
							Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
							der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
							Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
							</div>
						</section>
						{/* Liability for Links */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Haftung für Links</h2>
							<div className="space-y-2 text-gray-700">
							<p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
							Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
							Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten 
							wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren 
							zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
							<p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte 
							einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige 
							Links umgehend entfernen.</p>
							</div>
						</section>
						{/* Copyright */}
						<section>
							<h2 className="text-xl font-bold mb-4 text-gray-800">Urheberrecht</h2>
							<div className="space-y-2 text-gray-700">
							<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
							Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
							Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
							Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
							<p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
							Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem 
							auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei 
							Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
							</div>
						</section>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Impressum
