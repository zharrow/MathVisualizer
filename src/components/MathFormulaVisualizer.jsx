import React, { useState, useEffect, useRef, useMemo } from 'react';

const MathFormulaVisualizer = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [formulas, setFormulas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [params, setParams] = useState({ 
    a: 1, b: 0, c: 0, d: 0, 
    r: 2, theta: 0, n: 5, k: 0.5,
    x1: -2, y1: -1, x2: 2, y2: 1,
    amplitude: 1, frequency: 1, phase: 0, offset: 0,
    time: 0, iterations: 100, zoom: 1, scale: 40
  });
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    const loadFormulas = async () => {
      try {
        // Pour Vite, le fichier dans src/assets peut être importé directement
        const response = await fetch('/src/assets/Formules_math_matiques_visuelles.csv');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {});
        });
        
        setFormulas(data);
      } catch (error) {
        console.error('Error loading formulas:', error);
        // Utiliser les données déjà présentes dans le fichier CSV
        const csvData = `Nom de la formule,Formule,Catégorie,Applications visuelles
Équation quadratique,ax² + bx + c = 0,Algèbre,Courbes, résolution graphique
Équation cubique,ax³ + bx² + cx + d = 0,Algèbre,Formes complexes
Identité remarquable,(a + b)² = a² + 2ab + b²,Algèbre,Décomposition graphique
Produit remarquable,(a - b)(a + b) = a² - b²,Algèbre,Effets symétriques
Factorisation,ax² + bx = x(ax + b),Algèbre,Visualisation du regroupement
Dérivée de f(x),f'(x) = lim(h→0)[f(x+h)-f(x)]/h,Analyse,Tangentes, pente instantanée
Intégrale définie,∫ₐᵇ f(x) dx,Analyse,Aire sous une courbe
Limite,lim(x→a) f(x),Analyse,Comportement aux bords
Série de Taylor,f(x) ≈ f(a) + f'(a)(x-a) + ...,Analyse,Approximations animées
Croissance exponentielle,y = Ce^{kt},Analyse,Courbes de croissance
Distance entre 2 points,d = √((x₂-x₁)² + (y₂-y₁)²),Géométrie analytique,Mesure de déplacement
Milieu d'un segment,M = ((x₁+x₂)/2, (y₁+y₂)/2),Géométrie analytique,Visualisation de points centraux
Équation du cercle,x² + y² = r²,Géométrie analytique,Cercle simple
Ellipse,(x²/a²) + (y²/b²) = 1,Géométrie analytique,Visualisation orbitale
Hyperbole,(x²/a²) - (y²/b²) = 1,Géométrie analytique,Axes croisés, effet dramatique
Identité fondamentale,sin²x + cos²x = 1,Trigonométrie,Cercles trigonométriques
Loi des sinus,a/sinA = b/sinB,Trigonométrie,Triangulation
Loi des cosinus,c² = a² + b² - 2ab cos(C),Trigonométrie,Mesure d'angles visuels
Fonction sinusoïdale,y = A sin(Bx + C) + D,Trigonométrie,Oscillations
Cercle trigonométrique,x = cosθ, y = sinθ,Trigonométrie,Rotation angulaire
Forme algébrique,z = a + bi,Nombres complexes,Plans complexes
Forme exponentielle,z = re^{iθ},Nombres complexes,Spirales
Module,|z| = √(a² + b²),Nombres complexes,Rayons dynamiques
Produit complexe,z₁z₂ = r₁r₂ e^{i(θ₁+θ₂)},Nombres complexes,Rotation et échelle
Fractale de Mandelbrot,z = z² + c,Nombres complexes,Exploration infinie
Espérance,E(X) = ∑ xP(x),Probabilités et statistiques,Centre de distribution
Variance,Var(X) = E[(X - μ)²],Probabilités et statistiques,Dispersion graphique
Écart-type,σ = √Var(X),Probabilités et statistiques,Échelle d'écart
Loi normale,f(x) = ...,Probabilités et statistiques,Courbe en cloche
Loi binomiale,P(k) = C(n, k)p^k(1-p)^{n-k},Probabilités et statistiques,Histogrammes
Suite arithmétique,uₙ = u₀ + nr,Suites et séries,Progression linéaire
Suite géométrique,uₙ = u₀·qⁿ,Suites et séries,Croissance exponentielle
Somme de n premiers,S = n(n+1)/2,Suites et séries,Triangulation animée
Suite de Fibonacci,F(n) = F(n-1) + F(n-2),Suites et séries,Spirales naturelles
Série harmonique,∑ 1/n,Suites et séries,Graphes denses
Attracteur de Lorenz,...,Fractales et systèmes dynamiques,Chaotique en 3D
Ensemble de Julia,z = z² + c,Fractales et systèmes dynamiques,Exploration fractale
Système logistique,xₙ₊₁ = rxₙ(1 - xₙ),Fractales et systèmes dynamiques,Transition ordre/chaos
Dragon de Heighway,Itération géométrique,Fractales et systèmes dynamiques,Fractale animée
Tapis de Sierpinski,Subdivision récursive,Fractales et systèmes dynamiques,Réduction d'échelle`;
        
        const lines = csvData.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {});
        });
        
        setFormulas(data);
      }
    };
    
    loadFormulas();
  }, []);

  const currentFormula = formulas[currentIndex] || {};
  
  // Animation continue
  useEffect(() => {
    const animate = () => {
      setParams(prev => ({
        ...prev,
        time: prev.time + 0.02,
        theta: (prev.theta + 0.02) % (2 * Math.PI)
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (animating) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animating]);
  
  // Fonction de rendu principale
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentFormula['Nom de la formule']) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear et setup
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = params.scale * params.zoom;
    
    const toCanvasX = x => centerX + x * scale;
    const toCanvasY = y => centerY - y * scale;
    const fromCanvasX = px => (px - centerX) / scale;
    const fromCanvasY = py => (centerY - py) / scale;
    
    // Dessiner la grille
    const drawGrid = () => {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      
      const step = Math.max(1, Math.floor(20 / params.zoom));
      for (let i = -50; i <= 50; i += step) {
        if (i !== 0) {
          ctx.beginPath();
          ctx.moveTo(toCanvasX(i), 0);
          ctx.lineTo(toCanvasX(i), height);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(0, toCanvasY(i));
          ctx.lineTo(width, toCanvasY(i));
          ctx.stroke();
        }
      }
      
      // Axes
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();
    };
    
    drawGrid();
    
    // Sélectionner la visualisation appropriée
    switch (currentIndex + 1) {
      case 1: // Équation quadratique
        drawQuadratic(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 2: // Équation cubique
        drawCubic(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 3: // Identité remarquable
        drawRemarkableIdentity(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 4: // Produit remarquable
        drawRemarkableProduct(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 5: // Factorisation
        drawFactorization(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 6: // Dérivée
        drawDerivative(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 7: // Intégrale
        drawIntegral(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 8: // Limite
        drawLimit(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 9: // Série de Taylor
        drawTaylorSeries(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 10: // Croissance exponentielle
        drawExponential(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 11: // Distance entre points
        drawDistance(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 12: // Milieu segment
        drawMidpoint(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 13: // Cercle
        drawCircle(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 14: // Ellipse
        drawEllipse(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 15: // Hyperbole
        drawHyperbola(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 16: // Identité trigonométrique
        drawTrigIdentity(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 17: // Loi des sinus
        drawSineLaw(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 18: // Loi des cosinus
        drawCosineLaw(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 19: // Fonction sinusoïdale
        drawSineWave(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 20: // Cercle trigonométrique
        drawUnitCircle(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 21: // Nombre complexe
        drawComplexNumber(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 22: // Forme exponentielle
        drawComplexExponential(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 23: // Module complexe
        drawComplexModulus(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 24: // Produit complexe
        drawComplexProduct(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 25: // Mandelbrot
        drawMandelbrot(ctx, params, toCanvasX, toCanvasY, width, height, fromCanvasX, fromCanvasY);
        break;
      case 26: // Espérance
        drawExpectation(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 27: // Variance
        drawVariance(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 28: // Écart-type
        drawStandardDeviation(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 29: // Loi normale
        drawNormalDistribution(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 30: // Loi binomiale
        drawBinomialDistribution(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 31: // Suite arithmétique
        drawArithmeticSequence(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 32: // Suite géométrique
        drawGeometricSequence(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 33: // Somme des n premiers
        drawTriangularNumbers(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 34: // Fibonacci
        drawFibonacciSpiral(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 35: // Série harmonique
        drawHarmonicSeries(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 36: // Lorenz
        drawLorenzAttractor(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 37: // Julia
        drawJuliaSet(ctx, params, toCanvasX, toCanvasY, width, height, fromCanvasX, fromCanvasY);
        break;
      case 38: // Système logistique
        drawLogisticMap(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 39: // Dragon
        drawDragonCurve(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
      case 40: // Sierpinski
        drawSierpinskiCarpet(ctx, params, toCanvasX, toCanvasY, width, height);
        break;
    }
  }, [params, currentIndex, formulas]);
  
  // Obtenir les contrôles appropriés pour chaque formule
  const getControls = () => {
    const index = currentIndex + 1;
    
    if (index <= 5) { // Algèbre
      return ['a', 'b', 'c', 'd'].slice(0, index === 2 ? 4 : 3);
    } else if (index <= 10) { // Analyse
      return ['a', 'b', 'c', 'iterations'];
    } else if (index <= 15) { // Géométrie
      if (index === 11 || index === 12) return ['x1', 'y1', 'x2', 'y2'];
      return ['a', 'b', 'r'];
    } else if (index <= 20) { // Trigonométrie
      return ['amplitude', 'frequency', 'phase', 'theta'];
    } else if (index <= 25) { // Complexes
      return ['a', 'b', 'zoom', 'iterations'];
    } else if (index <= 30) { // Stats
      return ['a', 'b', 'n'];
    } else if (index <= 35) { // Suites
      return ['a', 'r', 'n'];
    } else { // Fractales
      return ['zoom', 'iterations', 'a', 'b'];
    }
  };
  
  const controls = getControls();
  
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="border border-white p-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">Visualiseur de Formules Mathématiques</h1>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-green-400">{currentFormula['Nom de la formule'] || 'Chargement...'}</h2>
              <p className="text-gray-400">{currentFormula['Catégorie']}</p>
            </div>
            <div className="text-2xl text-yellow-400 font-bold">
              {currentFormula['Formule']}
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="border border-white p-4 mb-6">
          <canvas 
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full max-w-4xl mx-auto bg-gray-900"
          />
        </div>
        
        {/* Contrôles */}
        <div className="border border-white p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">Paramètres</h3>
            <button
              onClick={() => setAnimating(!animating)}
              className={`px-4 py-2 border border-white transition-colors ${
                animating ? 'bg-white text-black' : 'hover:bg-white hover:text-black'
              }`}
            >
              {animating ? 'Pause' : 'Animer'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {controls.map(param => (
              <div key={param} className="space-y-2">
                <label className="text-sm text-gray-400">
                  {param} = {params[param].toFixed(2)}
                </label>
                <input
                  type="range"
                  min={getParamRange(param).min}
                  max={getParamRange(param).max}
                  step={getParamRange(param).step}
                  value={params[param]}
                  onChange={(e) => setParams(prev => ({ 
                    ...prev, 
                    [param]: parseFloat(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button 
            className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            onClick={() => {
              setCurrentIndex(Math.max(0, currentIndex - 1));
              setParams(prev => ({ ...prev, time: 0, iterations: 100 }));
            }}
            disabled={currentIndex === 0}
          >
            ← Précédent
          </button>
          <span className="flex items-center">
            {currentIndex + 1} / {formulas.length}
          </span>
          <button 
            className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            onClick={() => {
              setCurrentIndex(Math.min(formulas.length - 1, currentIndex + 1));
              setParams(prev => ({ ...prev, time: 0, iterations: 100 }));
            }}
            disabled={currentIndex >= formulas.length - 1}
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
};

// Fonctions de visualisation
function drawQuadratic(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, c } = params;
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff88';
  
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = a * x * x + b * x + c;
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Racines
  const discriminant = b * b - 4 * a * c;
  if (discriminant >= 0 && a !== 0) {
    const sqrt = Math.sqrt(discriminant);
    const roots = [(-b - sqrt) / (2 * a), (-b + sqrt) / (2 * a)];
    
    ctx.fillStyle = '#ff4444';
    roots.forEach(root => {
      ctx.beginPath();
      ctx.arc(toCanvasX(root), toCanvasY(0), 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  
  // Sommet
  if (a !== 0) {
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    
    ctx.fillStyle = '#4444ff';
    ctx.beginPath();
    ctx.arc(toCanvasX(vx), toCanvasY(vy), 6, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawCubic(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, c, d } = params;
  
  ctx.strokeStyle = '#ff88ff';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff88ff';
  
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = a * x * x * x + b * x * x + c * x + d;
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Points d'inflexion
  if (a !== 0) {
    const inflectionX = -b / (3 * a);
    const inflectionY = a * Math.pow(inflectionX, 3) + b * Math.pow(inflectionX, 2) + c * inflectionX + d;
    
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(toCanvasX(inflectionX), toCanvasY(inflectionY), 6, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawRemarkableIdentity(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Carré total
  const totalSize = Math.abs(a + b) * params.scale;
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - totalSize/2, centerY - totalSize/2, totalSize, totalSize);
  
  // Décomposition
  const aSize = Math.abs(a) * params.scale;
  const bSize = Math.abs(b) * params.scale;
  
  // a²
  ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
  ctx.fillRect(centerX - totalSize/2, centerY - totalSize/2, aSize, aSize);
  ctx.strokeStyle = '#ff0000';
  ctx.strokeRect(centerX - totalSize/2, centerY - totalSize/2, aSize, aSize);
  
  // b²
  ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
  ctx.fillRect(centerX - totalSize/2 + aSize, centerY - totalSize/2 + aSize, bSize, bSize);
  ctx.strokeStyle = '#0000ff';
  ctx.strokeRect(centerX - totalSize/2 + aSize, centerY - totalSize/2 + aSize, bSize, bSize);
  
  // 2ab
  ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
  ctx.fillRect(centerX - totalSize/2 + aSize, centerY - totalSize/2, bSize, aSize);
  ctx.fillRect(centerX - totalSize/2, centerY - totalSize/2 + aSize, aSize, bSize);
  ctx.strokeStyle = '#ffff00';
  ctx.strokeRect(centerX - totalSize/2 + aSize, centerY - totalSize/2, bSize, aSize);
  ctx.strokeRect(centerX - totalSize/2, centerY - totalSize/2 + aSize, aSize, bSize);
  
  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  if (aSize > 20) ctx.fillText('a²', centerX - totalSize/2 + aSize/2 - 10, centerY - totalSize/2 + aSize/2);
  if (aSize > 20 && bSize > 20) {
    ctx.fillText('ab', centerX - totalSize/2 + aSize + bSize/2 - 10, centerY - totalSize/2 + aSize/2);
    ctx.fillText('ab', centerX - totalSize/2 + aSize/2 - 10, centerY - totalSize/2 + aSize + bSize/2);
  }
  if (bSize > 20) ctx.fillText('b²', centerX - totalSize/2 + aSize + bSize/2 - 10, centerY - totalSize/2 + aSize + bSize/2);
}

function drawSineWave(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { amplitude, frequency, phase, time } = params;
  
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ffff';
  
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = amplitude * Math.sin(frequency * x + phase + time);
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Point mobile
  const currentX = 0;
  const currentY = amplitude * Math.sin(phase + time);
  
  ctx.fillStyle = '#ff00ff';
  ctx.beginPath();
  ctx.arc(toCanvasX(currentX), toCanvasY(currentY), 8, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMandelbrot(ctx, params, toCanvasX, toCanvasY, width, height, fromCanvasX, fromCanvasY) {
  const { iterations, zoom } = params;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      const x0 = fromCanvasX(px) / zoom;
      const y0 = fromCanvasY(py) / zoom;
      
      let x = 0, y = 0;
      let iter = 0;
      
      while (x*x + y*y <= 4 && iter < iterations) {
        const xtemp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = xtemp;
        iter++;
      }
      
      const idx = (py * width + px) * 4;
      if (iter === iterations) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      } else {
        const color = (iter / iterations) * 255;
        data[idx] = color * 0.5;
        data[idx + 1] = color;
        data[idx + 2] = color * 2;
      }
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function drawFibonacciSpiral(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { n } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Générer la suite
  const fib = [0, 1];
  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i-1] + fib[i-2];
  }
  
  // Dessiner les carrés et la spirale
  let x = 0, y = 0;
  let direction = 0; // 0: droite, 1: bas, 2: gauche, 3: haut
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  
  for (let i = 1; i <= Math.min(n, 10); i++) {
    const size = fib[i] * 5;
    
    // Carré
    ctx.strokeRect(centerX + x, centerY - y - size, size, size);
    
    // Arc de spirale
    ctx.beginPath();
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 3;
    
    let startAngle, endAngle, arcX, arcY;
    switch (direction % 4) {
      case 0: // droite
        arcX = centerX + x;
        arcY = centerY - y;
        startAngle = -Math.PI/2;
        endAngle = 0;
        x += size;
        break;
      case 1: // bas
        arcX = centerX + x;
        arcY = centerY - y;
        startAngle = Math.PI;
        endAngle = -Math.PI/2;
        y -= size;
        break;
      case 2: // gauche
        arcX = centerX + x;
        arcY = centerY - y;
        startAngle = Math.PI/2;
        endAngle = Math.PI;
        x -= size;
        break;
      case 3: // haut
        arcX = centerX + x;
        arcY = centerY - y;
        startAngle = 0;
        endAngle = Math.PI/2;
        y += size;
        break;
    }
    
    ctx.arc(arcX, arcY, size, startAngle, endAngle);
    ctx.stroke();
    
    direction++;
  }
}

// Ajouter d'autres fonctions de visualisation...
function drawUnitCircle(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { theta } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.abs(3 * params.scale);
  
  // Cercle unité
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Rayon
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + radius * Math.cos(theta), centerY - radius * Math.sin(theta));
  ctx.stroke();
  
  // Projections
  ctx.strokeStyle = '#ff4444';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(centerX + radius * Math.cos(theta), centerY - radius * Math.sin(theta));
  ctx.lineTo(centerX + radius * Math.cos(theta), centerY);
  ctx.stroke();
  
  ctx.strokeStyle = '#4444ff';
  ctx.beginPath();
  ctx.moveTo(centerX + radius * Math.cos(theta), centerY - radius * Math.sin(theta));
  ctx.lineTo(centerX, centerY - radius * Math.sin(theta));
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(`cos(θ) = ${Math.cos(theta).toFixed(2)}`, centerX + radius + 20, centerY);
  ctx.fillText(`sin(θ) = ${Math.sin(theta).toFixed(2)}`, centerX, centerY - radius - 20);
  ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(0)}°`, centerX + radius * Math.cos(theta) + 10, 
               centerY - radius * Math.sin(theta) - 10);
}

// Helpers
function getParamRange(param) {
  const ranges = {
    a: { min: -5, max: 5, step: 0.1 },
    b: { min: -5, max: 5, step: 0.1 },
    c: { min: -5, max: 5, step: 0.1 },
    d: { min: -5, max: 5, step: 0.1 },
    r: { min: -5, max: 5, step: 0.1 },
    theta: { min: 0, max: 2 * Math.PI, step: 0.01 },
    n: { min: 1, max: 20, step: 1 },
    k: { min: 0, max: 1, step: 0.01 },
    x1: { min: -10, max: 10, step: 0.1 },
    y1: { min: -10, max: 10, step: 0.1 },
    x2: { min: -10, max: 10, step: 0.1 },
    y2: { min: -10, max: 10, step: 0.1 },
    amplitude: { min: 0, max: 5, step: 0.1 },
    frequency: { min: 0.1, max: 5, step: 0.1 },
    phase: { min: 0, max: 2 * Math.PI, step: 0.01 },
    offset: { min: -5, max: 5, step: 0.1 },
    iterations: { min: 10, max: 500, step: 10 },
    zoom: { min: 0.1, max: 10, step: 0.1 },
    scale: { min: 10, max: 100, step: 5 }
  };
  
  return ranges[param] || { min: -5, max: 5, step: 0.1 };
}

// Fonctions stub pour les autres visualisations
function drawRemarkableProduct(ctx, params, toCanvasX, toCanvasY, width, height) {
  drawQuadratic(ctx, { ...params, a: 1, b: 0, c: -params.a * params.a }, toCanvasX, toCanvasY, width, height);
}

function drawFactorization(ctx, params, toCanvasX, toCanvasY, width, height) {
  drawQuadratic(ctx, { ...params, c: 0 }, toCanvasX, toCanvasY, width, height);
}

function drawDerivative(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, c } = params;
  
  // Fonction originale
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = a * x * x + b * x + c;
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Tangente au point x=1
  const x0 = 1;
  const y0 = a * x0 * x0 + b * x0 + c;
  const slope = 2 * a * x0 + b;
  
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = y0 + slope * (x - x0);
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Point de tangence
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(toCanvasX(x0), toCanvasY(y0), 6, 0, 2 * Math.PI);
  ctx.fill();
}

function drawIntegral(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, c } = params;
  const x1 = -2, x2 = 2;
  
  // Fonction
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = a * x * x + b * x + c;
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Aire sous la courbe
  ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
  ctx.beginPath();
  ctx.moveTo(toCanvasX(x1), toCanvasY(0));
  for (let x = x1; x <= x2; x += 0.01) {
    const y = a * x * x + b * x + c;
    ctx.lineTo(toCanvasX(x), toCanvasY(y));
  }
  ctx.lineTo(toCanvasX(x2), toCanvasY(0));
  ctx.closePath();
  ctx.fill();
}

function drawLimit(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a } = params;
  
  // Fonction avec discontinuité
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  
  // Partie gauche
  ctx.beginPath();
  for (let px = 0; px < width/2 - 2; px++) {
    const x = (px - width/2) / params.scale;
    const y = (x * x - a * a) / (x - a);
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Partie droite
  ctx.beginPath();
  for (let px = width/2 + 2; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = (x * x - a * a) / (x - a);
    const py = toCanvasY(y);
    
    if (px === width/2 + 2) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Limite
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(toCanvasX(a), toCanvasY(2 * a), 6, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawTaylorSeries(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { n } = params;
  
  // Fonction originale (sin(x))
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = Math.sin(x);
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Approximation de Taylor
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    let y = 0;
    
    // Calcul de la série de Taylor pour sin(x)
    for (let i = 0; i <= n; i++) {
      const term = Math.pow(-1, i) * Math.pow(x, 2*i + 1) / factorial(2*i + 1);
      y += term;
    }
    
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function drawExponential(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, k } = params;
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff88';
  
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = a * Math.exp(k * x);
    const py = toCanvasY(y);
    
    if (px === 0) ctx.moveTo(px, py);
    else if (py > 0 && py < height) ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawDistance(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { x1, y1, x2, y2 } = params;
  
  // Points
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(toCanvasX(x1), toCanvasY(y1), 8, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(toCanvasX(x2), toCanvasY(y2), 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Ligne
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
  ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
  ctx.stroke();
  
  // Distance
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`d = ${distance.toFixed(2)}`, 
               toCanvasX((x1 + x2) / 2) + 10, 
               toCanvasY((y1 + y2) / 2) - 10);
}

function drawMidpoint(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { x1, y1, x2, y2 } = params;
  
  // Points extrêmes
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(toCanvasX(x1), toCanvasY(y1), 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(toCanvasX(x2), toCanvasY(y2), 6, 0, 2 * Math.PI);
  ctx.fill();
  
  // Segment
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
  ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
  ctx.stroke();
  
  // Milieu
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(toCanvasX(mx), toCanvasY(my), 8, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(`M(${mx.toFixed(1)}, ${my.toFixed(1)})`, 
               toCanvasX(mx) + 10, toCanvasY(my) - 10);
}

function drawCircle(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { r, time } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Cercle principal (utiliser la valeur absolue du rayon)
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff88';
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.abs(r * params.scale), 0, 2 * Math.PI);
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Point mobile
  const angle = time;
  const px = centerX + Math.abs(r * params.scale) * Math.cos(angle);
  const py = centerY - Math.abs(r * params.scale) * Math.sin(angle);
  
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Rayon
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(px, py);
  ctx.stroke();
}

function drawEllipse(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, time } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Ellipse (utiliser les valeurs absolues pour les rayons)
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff88';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, Math.abs(a * params.scale), Math.abs(b * params.scale), 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Point mobile (paramétrage)
  const angle = time;
  const px = centerX + Math.abs(a * params.scale) * Math.cos(angle);
  const py = centerY - Math.abs(b * params.scale) * Math.sin(angle);
  
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Foyers
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  const c = Math.sqrt(Math.abs(absA * absA - absB * absB));
  if (absA > absB) {
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(centerX - c * params.scale, centerY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + c * params.scale, centerY, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawHyperbola(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b } = params;
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  
  ctx.strokeStyle = '#ff88ff';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff88ff';
  
  // Branche droite
  ctx.beginPath();
  for (let x = absA; x <= 10; x += 0.1) {
    const y = absB * Math.sqrt(x * x / (absA * absA) - 1);
    ctx.lineTo(toCanvasX(x), toCanvasY(y));
  }
  ctx.stroke();
  
  ctx.beginPath();
  for (let x = absA; x <= 10; x += 0.1) {
    const y = -absB * Math.sqrt(x * x / (absA * absA) - 1);
    ctx.lineTo(toCanvasX(x), toCanvasY(y));
  }
  ctx.stroke();
  
  // Branche gauche
  ctx.beginPath();
  for (let x = -absA; x >= -10; x -= 0.1) {
    const y = absB * Math.sqrt(x * x / (absA * absA) - 1);
    ctx.lineTo(toCanvasX(x), toCanvasY(y));
  }
  ctx.stroke();
  
  ctx.beginPath();
  for (let x = -absA; x >= -10; x -= 0.1) {
    const y = -absB * Math.sqrt(x * x / (absA * absA) - 1);
    ctx.lineTo(toCanvasX(x), toCanvasY(y));
  }
  ctx.stroke();
  
  ctx.shadowBlur = 0;
  
  // Asymptotes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, toCanvasY(-10 * absB / absA));
  ctx.lineTo(width, toCanvasY(10 * absB / absA));
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(0, toCanvasY(10 * absB / absA));
  ctx.lineTo(width, toCanvasY(-10 * absB / absA));
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawTrigIdentity(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { theta } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.abs(3 * params.scale);
  
  // Cercle unité
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // sin²θ (aire)
  const sinValue = Math.sin(theta);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
  const sinHeight = Math.abs(radius * sinValue * sinValue);
  ctx.fillRect(centerX - radius, centerY - sinHeight, 
               radius * 2, sinHeight);
  
  // cos²θ (aire)
  const cosValue = Math.cos(theta);
  ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
  const cosHeight = Math.abs(radius * cosValue * cosValue);
  ctx.fillRect(centerX - radius, centerY, 
               radius * 2, cosHeight);
  
  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`sin²θ = ${(sinValue * sinValue).toFixed(3)}`, centerX - radius - 150, centerY - radius);
  ctx.fillText(`cos²θ = ${(cosValue * cosValue).toFixed(3)}`, centerX - radius - 150, centerY);
  ctx.fillText(`sin²θ + cos²θ = ${(sinValue * sinValue + cosValue * cosValue).toFixed(3)}`, 
               centerX - radius - 150, centerY + radius);
}

function drawSineLaw(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, c } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Triangle
  const scale = Math.abs(params.scale * 2);
  const A = { x: centerX - Math.abs(a) * scale, y: centerY + 100 };
  const B = { x: centerX + Math.abs(b) * scale, y: centerY + 100 };
  const C = { x: centerX, y: centerY - Math.abs(c) * scale };
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.closePath();
  ctx.stroke();
  
  // Sommets
  ctx.fillStyle = '#ff4444';
  [A, B, C].forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText('A', A.x - 20, A.y + 20);
  ctx.fillText('B', B.x + 10, B.y + 20);
  ctx.fillText('C', C.x - 20, C.y - 10);
  ctx.fillText(`a = ${Math.abs(a).toFixed(1)}`, (B.x + C.x) / 2 + 20, (B.y + C.y) / 2);
  ctx.fillText(`b = ${Math.abs(b).toFixed(1)}`, (A.x + C.x) / 2 - 40, (A.y + C.y) / 2);
  ctx.fillText(`c = ${Math.abs(c).toFixed(1)}`, centerX, A.y + 30);
}

function drawCosineLaw(ctx, params, toCanvasX, toCanvasY, width, height) {
  drawSineLaw(ctx, params, toCanvasX, toCanvasY, width, height);
}

function drawComplexNumber(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b, time } = params;
  
  // Plan complexe
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(0));
  ctx.lineTo(toCanvasX(a), toCanvasY(b));
  ctx.stroke();
  
  // Point
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(toCanvasX(a), toCanvasY(b), 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Projections
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(toCanvasX(a), toCanvasY(0));
  ctx.lineTo(toCanvasX(a), toCanvasY(b));
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(b));
  ctx.lineTo(toCanvasX(a), toCanvasY(b));
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`z = ${a.toFixed(1)} + ${b.toFixed(1)}i`, toCanvasX(a) + 10, toCanvasY(b) - 10);
  ctx.fillText(`|z| = ${Math.sqrt(a*a + b*b).toFixed(2)}`, toCanvasX(a/2), toCanvasY(b/2) - 20);
}

function drawComplexExponential(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { r, theta, time } = params;
  
  // Spirale
  ctx.strokeStyle = '#ff88ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t <= time; t += 0.05) {
    const radius = Math.abs(r) * Math.exp(0.1 * t);
    const angle = theta + t;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    if (t === 0) ctx.moveTo(toCanvasX(x), toCanvasY(y));
    else ctx.lineTo(toCanvasX(x), toCanvasY(y));
  }
  ctx.stroke();
  
  // Point actuel
  const currentR = Math.abs(r) * Math.exp(0.1 * time);
  const currentAngle = theta + time;
  const currentX = currentR * Math.cos(currentAngle);
  const currentY = currentR * Math.sin(currentAngle);
  
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(toCanvasX(currentX), toCanvasY(currentY), 8, 0, 2 * Math.PI);
  ctx.fill();
}

function drawComplexModulus(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a, b } = params;
  
  // Cercle de module constant
  const modulus = Math.sqrt(a * a + b * b);
  
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(toCanvasX(0), toCanvasY(0), Math.abs(modulus * params.scale), 0, 2 * Math.PI);
  ctx.stroke();
  
  // Point z
  drawComplexNumber(ctx, params, toCanvasX, toCanvasY, width, height);
}

function drawComplexProduct(ctx, params, toCanvasX, toCanvasY, width, height) {
  const z1 = { r: 2, theta: Math.PI / 4 };
  const z2 = { r: Math.abs(params.r), theta: params.theta };
  
  // z1
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(0));
  const x1 = z1.r * Math.cos(z1.theta);
  const y1 = z1.r * Math.sin(z1.theta);
  ctx.lineTo(toCanvasX(x1), toCanvasY(y1));
  ctx.stroke();
  
  // z2
  ctx.strokeStyle = '#ff4444';
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(0));
  const x2 = z2.r * Math.cos(z2.theta);
  const y2 = z2.r * Math.sin(z2.theta);
  ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
  ctx.stroke();
  
  // Produit
  const productR = z1.r * z2.r;
  const productTheta = z1.theta + z2.theta;
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(0));
  const xp = productR * Math.cos(productTheta);
  const yp = productR * Math.sin(productTheta);
  ctx.lineTo(toCanvasX(xp), toCanvasY(yp));
  ctx.stroke();
  
  // Points
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(toCanvasX(x1), toCanvasY(y1), 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(toCanvasX(x2), toCanvasY(y2), 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(toCanvasX(xp), toCanvasY(yp), 8, 0, 2 * Math.PI);
  ctx.fill();
}

function drawExpectation(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { n } = params;
  const values = [];
  const probs = [];
  
  // Distribution discrète
  for (let i = 1; i <= n; i++) {
    values.push(i);
    probs.push(1 / n); // Uniforme pour simplifier
  }
  
  // Barres
  const barWidth = Math.abs(params.scale * 0.8);
  ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
  
  values.forEach((val, i) => {
    const barHeight = Math.abs(probs[i] * 5 * params.scale);
    const barY = toCanvasY(probs[i] * 5);
    ctx.fillRect(toCanvasX(val) - barWidth/2, Math.min(barY, toCanvasY(0)), 
                 barWidth, barHeight);
  });
  
  // Espérance
  const expectation = values.reduce((sum, val, i) => sum + val * probs[i], 0);
  
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(expectation), 0);
  ctx.lineTo(toCanvasX(expectation), height);
  ctx.stroke();
  
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`E(X) = ${expectation.toFixed(2)}`, toCanvasX(expectation) + 10, 30);
}

function drawVariance(ctx, params, toCanvasX, toCanvasY, width, height) {
  drawExpectation(ctx, params, toCanvasX, toCanvasY, width, height);
  
  // Ajouter visualisation de la dispersion
  const { n } = params;
  const mean = (n + 1) / 2;
  const variance = ((n * n - 1) / 12);
  
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  const std = Math.sqrt(variance);
  ctx.beginPath();
  ctx.moveTo(toCanvasX(mean - std), 0);
  ctx.lineTo(toCanvasX(mean - std), height);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(toCanvasX(mean + std), 0);
  ctx.lineTo(toCanvasX(mean + std), height);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(`σ² = ${variance.toFixed(2)}`, toCanvasX(mean) + 10, 50);
}

function drawStandardDeviation(ctx, params, toCanvasX, toCanvasY, width, height) {
  drawVariance(ctx, params, toCanvasX, toCanvasY, width, height);
}

function drawNormalDistribution(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a: mean, b: std } = params;
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff88';
  
  ctx.beginPath();
  for (let px = 0; px <= width; px++) {
    const x = (px - width/2) / params.scale;
    const y = (1 / (std * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
    const py = toCanvasY(y * 5);
    
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Zones σ
  const colors = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(0, 255, 0, 0.2)'];
  const sigmas = [1, 2, 3];
  
  sigmas.forEach((sigma, i) => {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    for (let x = mean - sigma * std; x <= mean + sigma * std; x += 0.01) {
      const y = (1 / (std * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
      ctx.lineTo(toCanvasX(x), toCanvasY(y * 5));
    }
    ctx.lineTo(toCanvasX(mean + sigma * std), toCanvasY(0));
    ctx.lineTo(toCanvasX(mean - sigma * std), toCanvasY(0));
    ctx.closePath();
    ctx.fill();
  });
}

function drawBinomialDistribution(ctx, params, toCanvasX, toCanvasY, width, height) {
  const n = Math.floor(Math.abs(params.n));
  const p = 0.5;
  
  // Calculer les probabilités binomiales
  const probs = [];
  for (let k = 0; k <= n; k++) {
    const prob = binomial(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    probs.push(prob);
  }
  
  // Dessiner l'histogramme
  const barWidth = Math.abs(params.scale * 0.8);
  ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  
  probs.forEach((prob, k) => {
    const barHeight = Math.abs(prob * 10 * params.scale);
    const barY = toCanvasY(prob * 10);
    ctx.fillRect(toCanvasX(k) - barWidth/2, Math.min(barY, toCanvasY(0)), 
                 barWidth, barHeight);
    ctx.strokeRect(toCanvasX(k) - barWidth/2, Math.min(barY, toCanvasY(0)), 
                   barWidth, barHeight);
  });
}

function binomial(n, k) {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - k + i) / i;
  }
  return result;
}

function drawArithmeticSequence(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a: u0, r } = params;
  const n = Math.floor(Math.abs(params.n));
  
  // Points de la suite
  ctx.fillStyle = '#00ff88';
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  
  for (let i = 0; i <= n; i++) {
    const value = u0 + i * r;
    ctx.beginPath();
    ctx.arc(toCanvasX(i), toCanvasY(value), 6, 0, 2 * Math.PI);
    ctx.fill();
    
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(i - 1), toCanvasY(u0 + (i - 1) * r));
      ctx.lineTo(toCanvasX(i), toCanvasY(value));
      ctx.stroke();
    }
  }
  
  // Ligne de tendance
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(u0));
  ctx.lineTo(toCanvasX(n + 5), toCanvasY(u0 + (n + 5) * r));
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawGeometricSequence(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { a: u0, r } = params;
  const n = Math.floor(Math.abs(params.n));
  
  ctx.fillStyle = '#ff88ff';
  ctx.strokeStyle = '#ff88ff';
  ctx.lineWidth = 2;
  
  for (let i = 0; i <= n; i++) {
    const value = u0 * Math.pow(r, i);
    if (Math.abs(value) < 100) {
      ctx.beginPath();
      ctx.arc(toCanvasX(i), toCanvasY(value), 6, 0, 2 * Math.PI);
      ctx.fill();
      
      if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(toCanvasX(i - 1), toCanvasY(u0 * Math.pow(r, i - 1)));
        ctx.lineTo(toCanvasX(i), toCanvasY(value));
        ctx.stroke();
      }
    }
  }
}

function drawTriangularNumbers(ctx, params, toCanvasX, toCanvasY, width, height) {
  const n = Math.floor(Math.abs(params.n));
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Visualisation en triangle
  const size = 20;
  let row = 0;
  let col = 0;
  
  ctx.fillStyle = '#00ff88';
  for (let i = 1; i <= n * (n + 1) / 2; i++) {
    ctx.beginPath();
    ctx.arc(centerX + (col - row / 2) * size, 
            centerY - 200 + row * size, 
            8, 0, 2 * Math.PI);
    ctx.fill();
    
    col++;
    if (col > row) {
      row++;
      col = 0;
    }
  }
  
  // Formule
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.fillText(`S${n} = ${n * (n + 1) / 2}`, centerX - 50, centerY + 100);
}

function drawHarmonicSeries(ctx, params, toCanvasX, toCanvasY, width, height) {
  const n = Math.floor(params.n);
  
  // Barres de la série
  ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
  
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    const value = 1 / i;
    sum += value;
    
    const barWidth = Math.abs(params.scale * 0.8 / i);
    const barHeight = Math.abs(value * 5 * params.scale);
    const barY = toCanvasY(value * 5);
    
    ctx.fillRect(toCanvasX(i) - barWidth/2, Math.min(barY, toCanvasY(0)), 
                 barWidth, barHeight);
  }
  
  // Somme partielle
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), toCanvasY(sum / n * 5));
  ctx.lineTo(toCanvasX(n + 1), toCanvasY(sum / n * 5));
  ctx.stroke();
  
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`H${n} = ${sum.toFixed(3)}`, toCanvasX(n/2), toCanvasY(sum / n * 5) - 10);
}

function drawLorenzAttractor(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { time, a: sigma, b: rho, c: beta } = params;
  const dt = 0.01;
  
  // Paramètres classiques de Lorenz
  const s = sigma || 10;
  const r = rho || 28;
  const b = beta || 8/3;
  
  ctx.strokeStyle = '#ff88ff';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.8;
  
  let x = 0.1, y = 0, z = 0;
  
  ctx.beginPath();
  for (let i = 0; i < time * 100; i++) {
    const dx = s * (y - x) * dt;
    const dy = (r * x - y - x * z) * dt;
    const dz = (x * y - b * z) * dt;
    
    x += dx;
    y += dy;
    z += dz;
    
    const px = toCanvasX(x / 10);
    const py = toCanvasY(z / 10 - 2);
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawJuliaSet(ctx, params, toCanvasX, toCanvasY, width, height, fromCanvasX, fromCanvasY) {
  const { a: cr, b: ci, iterations, zoom } = params;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      let zr = fromCanvasX(px) / zoom;
      let zi = fromCanvasY(py) / zoom;
      let iter = 0;
      
      while (zr*zr + zi*zi <= 4 && iter < iterations) {
        const tmp = zr*zr - zi*zi + cr;
        zi = 2*zr*zi + ci;
        zr = tmp;
        iter++;
      }
      
      const idx = (py * width + px) * 4;
      if (iter === iterations) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      } else {
        const color = (iter / iterations) * 255;
        data[idx] = color * 2;
        data[idx + 1] = color * 0.5;
        data[idx + 2] = color;
      }
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function drawLogisticMap(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { r, iterations } = params;
  let x = 0.5;
  
  ctx.fillStyle = '#00ff88';
  
  // Diagramme de bifurcation
  for (let ri = 2.5; ri <= 4; ri += 0.005) {
    let xi = 0.5;
    
    // Stabilisation
    for (let i = 0; i < 100; i++) {
      xi = ri * xi * (1 - xi);
    }
    
    // Points
    for (let i = 0; i < iterations / 10; i++) {
      xi = ri * xi * (1 - xi);
      ctx.fillRect(toCanvasX((ri - 2.5) * 4), toCanvasY(xi * 5), 1, 1);
    }
  }
  
  // Ligne de r actuel
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toCanvasX((r - 2.5) * 4), 0);
  ctx.lineTo(toCanvasX((r - 2.5) * 4), height);
  ctx.stroke();
}

function drawDragonCurve(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { iterations } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  let points = [[centerX - 100, centerY], [centerX + 100, centerY]];
  
  // Génération de la courbe du dragon
  for (let iter = 0; iter < Math.min(iterations / 10, 15); iter++) {
    const newPoints = [points[0]];
    
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const mx = (p1[0] + p2[0]) / 2;
      const my = (p1[1] + p2[1]) / 2;
      
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      
      const direction = (i % 2 === 0) ? 1 : -1;
      const nx = mx - dy / 2 * direction;
      const ny = my + dx / 2 * direction;
      
      newPoints.push([nx, ny]);
      newPoints.push(p2);
    }
    
    points = newPoints;
  }
  
  // Dessin
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#00ff88';
  
  ctx.beginPath();
  points.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point[0], point[1]);
    else ctx.lineTo(point[0], point[1]);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawSierpinskiCarpet(ctx, params, toCanvasX, toCanvasY, width, height) {
  const { iterations } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  const size = 300;
  
  ctx.fillStyle = '#00ff88';
  
  function drawCarpet(x, y, s, depth) {
    if (depth === 0) {
      ctx.fillRect(x, y, s, s);
      return;
    }
    
    const newSize = s / 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i !== 1 || j !== 1) {
          drawCarpet(x + i * newSize, y + j * newSize, newSize, depth - 1);
        }
      }
    }
  }
  
  drawCarpet(centerX - size/2, centerY - size/2, size, Math.min(iterations / 20, 5));
}

export default MathFormulaVisualizer;