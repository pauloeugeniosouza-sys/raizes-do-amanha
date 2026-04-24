import { Button } from "@/components/ui/button";
import { Music, Heart, Zap, Volume2, VolumeX } from "lucide-react";
import { useRef, useState, useEffect } from "react";

/**
 * Ancestral Modernism Design
 * - Playfair Display for bold, elegant typography
 * - Warm earth tones: Ochre (#C4A57B), Burnt Sienna (#A0522D), Cream (#F5E6D3)
 * - Asymmetric layout with generous whitespace
 * - Minimal cards, maximum impact through typography and spacing
 */

export default function Home() {
const audioRef = useRef<HTMLAudioElement | null>(null);
const [tocando, setTocando] = useState<string | null>(null);
const [indexAtual, setIndexAtual] = useState<number | null>(null);
const [pausado, setPausado] = useState(false);
const [progresso, setProgresso] = useState(0);
const [duracao, setDuracao] = useState(0);
const [volume, setVolume] = useState(1);
const [mute, setMute] = useState(false);

function tocarMusica(index: number) {
  if (!audioRef.current) return;

  const musica = tracks[index];

  audioRef.current.pause();
  audioRef.current.src = musica.arquivo;
  audioRef.current.load();

  audioRef.current.play()
    .then(() => {
      setTocando(musica.nome);
      setIndexAtual(index);
      setPausado(false);
    })
    .catch((e) => console.error(e));
}

function proximaFaixa() {
  if (indexAtual === null) return;

  const proximoIndex = indexAtual + 1;

  if (proximoIndex < tracks.length) {
    tocarMusica(proximoIndex);
  } else {
    // terminou todas
    setTocando(null);
    setIndexAtual(null);
    setPausado(false);
  }
}

function togglePlay() {
  if (!audioRef.current || !tocando) return;

  if (pausado) {
    audioRef.current.play();
    setPausado(false);
  } else {
    audioRef.current.pause();
    setPausado(true);
  }
}

function faixaAnterior() {
  if (indexAtual === null || indexAtual === 0) return;
  tocarMusica(indexAtual - 1);
}

function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
  const newVolume = parseFloat(e.target.value);
  setVolume(newVolume);
  if (audioRef.current) {
    audioRef.current.volume = newVolume;
  }
  setMute(newVolume === 0);
}

function toggleMute() {
  if (audioRef.current) {
    if (mute) {
      audioRef.current.volume = volume || 0.5;
      setMute(false);
    } else {
      audioRef.current.volume = 0;
      setMute(true);
    }
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Audio event handlers
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const handleTimeUpdate = () => {
    setProgresso(audio.currentTime);
    setDuracao(audio.duration || 0);
  };

  const handleLoadedMetadata = () => {
    setDuracao(audio.duration);
    audio.volume = volume;
  };

  audio.addEventListener("timeupdate", handleTimeUpdate);
  audio.addEventListener("loadedmetadata", handleLoadedMetadata);

  return () => {
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
  };
}, [volume]);

function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
  const newTime = parseFloat(e.target.value);
  setProgresso(newTime);
  if (audioRef.current) {
    audioRef.current.currentTime = newTime;
  }
}

 const tracks = [
  { nome: "A Luta de Um Pai", arquivo: "/musicas/faixa1.mp3" },
  { nome: "Ainda Somos Luz", arquivo: "/musicas/faixa2.mp3" },
  { nome: "Pelas Mãos da Coragem", arquivo: "/musicas/faixa3.mp3" },
  { nome: "Caleidoscópio da Vida", arquivo: "/musicas/faixa4.mp3" },
  { nome: "Chão de Esperança", arquivo: "/musicas/faixa5.mp3" },
  { nome: "Coroa de Amanhã", arquivo: "/musicas/faixa6.mp3" },
  { nome: "Farol da Nossa Casa", arquivo: "/musicas/faixa7.mp3" },
  { nome: "Filho do Meu Coração", arquivo: "/musicas/faixa8.mp3" },
  { nome: "O Soldado", arquivo: "/musicas/faixa9.mp3" },
  { nome: "Eco do Amanhã", arquivo: "/musicas/faixa10.mp3" },
];

  return (
    <div className="min-h-screen bg-white text-foreground">
      <audio ref={audioRef} onEnded={proximaFaixa} />

      {/* Now Playing Bar */}
      {tocando && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-white px-6 py-4 z-50 shadow-lg">
          <div className="container">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-white/70 w-10 text-right">
                {formatTime(progresso)}
              </span>
              <input
                type="range"
                min="0"
                max={duracao || 100}
                value={progresso}
                onChange={handleSeek}
                className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${(progresso / duracao) * 100}%, rgba(255,255,255,0.3) ${(progresso / duracao) * 100}%)`,
                }}
              />
              <span className="text-xs text-white/70 w-10">
                {formatTime(duracao)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              {/* Track Info with Sound Wave */}
              <div className="flex items-center gap-4">
                {/* Sound Wave Animation */}
                <div className="flex items-center gap-1 h-6">
                  {!pausado ? (
                    <>
                      <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: "60%", animationDelay: "0ms" }} />
                      <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: "100%", animationDelay: "150ms" }} />
                      <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: "40%", animationDelay: "300ms" }} />
                      <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: "80%", animationDelay: "450ms" }} />
                      <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: "50%", animationDelay: "600ms" }} />
                    </>
                  ) : (
                    <>
                      <span className="w-1 h-3 bg-white/50 rounded-full" />
                      <span className="w-1 h-4 bg-white/50 rounded-full" />
                      <span className="w-1 h-2 bg-white/50 rounded-full" />
                      <span className="w-1 h-3 bg-white/50 rounded-full" />
                      <span className="w-1 h-2 bg-white/50 rounded-full" />
                    </>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{tocando}</p>
                  <p className="text-xs text-white/70">
                    {pausado ? "Pausado" : "Tocando agora"}
                  </p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={faixaAnterior}
                  disabled={indexAtual === 0}
                  className="text-white/80 hover:text-white disabled:opacity-30"
                  title="Faixa anterior"
                >
                  ⏮
                </button>
                <button
                  onClick={togglePlay}
                  className="text-2xl text-white hover:text-white/80"
                  title={pausado ? "Reproduzir" : "Pausar"}
                >
                  {pausado ? "▶️" : "⏸️"}
                </button>
                <button
                  onClick={proximaFaixa}
                  className="text-white/80 hover:text-white"
                  title="Próxima faixa"
                >
                  ⏭
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white/80 hover:text-white"
                  title={mute ? "Ativar som" : "Silenciar"}
                >
                  {mute || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={mute ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  style={{
                    background: `linear-gradient(to right, white ${(mute ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(mute ? 0 : volume) * 100}%)`,
                  }}
                />
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setTocando(null);
                      setIndexAtual(null);
                      setPausado(false);
                    }
                  }}
                  className="text-white/80 hover:text-white ml-2"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <div className="text-2xl font-display font-bold text-primary">
            Raízes do Amanhã
          </div>
          <div className="flex gap-8 items-center">
            <a href="#conceito" className="text-sm font-mono text-foreground hover:text-primary transition-colors">
              Conceito
            </a>
            <a href="#tracklist" className="text-sm font-mono text-foreground hover:text-primary transition-colors">
              Faixas
            </a>
            <a href="#contato" className="text-sm font-mono text-foreground hover:text-primary transition-colors">
              Contato
            </a>
            <Button className="bg-primary hover:bg-accent text-white">
              Pré-Salvar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663144338219/Boh8A2dCDQoWHwV8o4NKSE/hero-raizes-bZvYbe2RCbKMzEMqdaGYCG.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-6">
              Novo Álbum
            </div>
            <h1 className="text-8xl md:text-9xl font-display font-bold text-foreground mb-8 leading-tight">
              Raízes do Amanhã
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/80 mb-12 max-w-2xl leading-relaxed">
              Um legado de amor e coragem. Dez faixas que celebram a força dos laços familiares e a jornada de superação.
            </p>
            <div className="flex gap-6">
              <Button size="lg" className="bg-primary hover:bg-accent text-white text-lg px-8 py-6">
                Ouça Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
              >
                Pré-Salvar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Conceito Section */}
      <section id="conceito" className="py-32 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-6">
                A Essência
              </div>
              <h2 className="text-6xl md:text-7xl font-display font-bold text-foreground mb-8">
                O Conceito do Álbum
              </h2>
              <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
                <strong>"Raízes do Amanhã"</strong> é uma profunda homenagem aos pilares da família, explorando temas de resiliência, amor incondicional e legado.
              </p>
              <p className="text-xl text-foreground/80 mb-12 leading-relaxed">
                Cada faixa é um tributo a membros da família, tecendo uma narrativa que celebra a força dos laços familiares e a jornada de superação que nos trouxe até aqui.
              </p>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
                    Inspiração
                  </h3>
                  <p className="text-foreground/80">
                    Histórias reais e sentimentos universais de conexão familiar e ancestralidade.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
                    Mensagem
                  </h3>
                  <p className="text-foreground/80">
                    A família como fonte inesgotável de força, luz e inspiração para o futuro.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="hidden lg:block h-96 rounded-sm"
              style={{
                backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663144338219/Boh8A2dCDQoWHwV8o4NKSE/concept-bg-8GLw6s3EHcfiGWBxHeebKb.webp')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </section>

      {/* Tracklist Section */}
      <section id="tracklist" className="py-32 bg-white">
        <div className="container">
          <div className="font-mono text-sm text-primary uppercase tracking-widest mb-6">
            Repertório
          </div>
          <h2 className="text-6xl md:text-7xl font-display font-bold text-foreground mb-20">
            As Vozes da Nossa História
          </h2>

          <div
            className="rounded-sm p-16 mb-12"
            style={{
              backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663144338219/Boh8A2dCDQoWHwV8o4NKSE/tracklist-bg-emf8fs78Yb2VyYn9XX37nE.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* 🎨 CAPA */}
              <div className="sticky top-32">
                <img
                  src="/capa.jpg"
                  alt="Capa do álbum"
                  className="w-full rounded-lg shadow-2xl"
                />
                {/* Info */}
                <div className="mt-6">
                  <h3 className="text-2xl font-display font-bold">
                    Raízes do Amanhã
                  </h3>
                  <p className="text-foreground/70">
                    Paulo Eugenio de Souza
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {tracks.map((track, index) => (
                  <div
                    key={index}
                    onClick={() => tocarMusica(index)}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition
                      ${tocando === track.nome
                        ? "bg-primary text-white"
                        : "bg-card hover:bg-muted"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-lg w-8">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="font-semibold">{track.nome}</p>
                        {tocando === track.nome && (
                          <span className="text-xs opacity-80">Tocando agora 🎵</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xl">
                      {tocando === track.nome ? "⏸" : "▶️"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-border p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-primary" />
                <h3 className="font-mono text-sm text-primary uppercase tracking-widest">
                  Proteção & Sacrifício
                </h3>
              </div>
              <p className="text-foreground/80">
                A força e a dedicação daqueles que nos guiam e protegem em meio às tempestades da vida.
              </p>
            </div>

            <div className="border border-border p-8">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-6 h-6 text-primary" />
                <h3 className="font-mono text-sm text-primary uppercase tracking-widest">
                  Afeto & Experiência
                </h3>
              </div>
              <p className="text-foreground/80">
                O amor puro e as múltiplas facetas da vida e dos relacionamentos que moldam nossa identidade.
              </p>
            </div>

            <div className="border border-border p-8">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="font-mono text-sm text-primary uppercase tracking-widest">
                  Esperança & Legado
                </h3>
              </div>
              <p className="text-foreground/80">
                A visão de um futuro construído sobre as bases sólidas do passado e a promessa de um novo ciclo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="py-32 bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl">
            <div className="font-mono text-sm text-white/80 uppercase tracking-widest mb-6">
              Próximos Passos
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-bold mb-8">
              Junte-se a Nós
            </h2>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              Descubra a jornada de "Raízes do Amanhã" em todas as plataformas de streaming. Pré-salve agora para receber notificações de lançamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              >
                Pré-Salvar no Spotify
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Seguir Artista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-display text-lg font-bold mb-4">Raízes do Amanhã</h3>
              <p className="text-white/70">
                Um álbum de homenagens familiares que celebra a força dos laços e a esperança do futuro.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest mb-4">Links</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#conceito" className="hover:text-white transition-colors">Conceito</a></li>
                <li><a href="#tracklist" className="hover:text-white transition-colors">Faixas</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest mb-4">Redes Sociais</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spotify</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/50 text-sm">
            <p>&copy; 2026 Raízes do Amanhã. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
