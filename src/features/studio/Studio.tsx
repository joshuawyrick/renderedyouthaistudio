import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Clock, Palette, ShieldCheck, Users, Wallet, Shirt, ClipboardList, Settings, ShoppingBag, LogOut, Camera, Upload } from 'lucide-react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { Action, Actor, Stage, stageLabels, transition, canGenerate, splitEarnings, publicationReady } from './workflow';
import { useAuth } from '@/contexts/AuthContext';
import { useArtists } from '@/hooks/useArtists';
import { useDesigns } from '@/hooks/useDesigns';
import { supabase } from '@/integrations/supabase/client';
import { generateMockups, fetchMockups, fetchAiStatus, type Mockup } from '@/services/mockupGenerationService';
import './studio.css';

type Artist = { id: string; display_name: string; avatar_type: string; age: number | null; state: string | null; show_age: boolean; show_state: boolean; bio: string; goal: string };
type Design = { id: string; artist_id: string; title: string; story: string; stage: Stage; selected_option: number; completed_batches: number; admin_credits: number; request_note: string | null; admin_note: string | null; variants_ready: boolean; history: any };
const sampleStyles = ['Bold & Graphic', 'Retro Print', 'Playful Cartoon', 'Painted'];
const money = (cents: number) => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export function StudioProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function useAuthState() {
  const auth = useAuth();
  return auth;
}

function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button className="studio-button" {...props}>{children}</button>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="studio-field"><span>{label}</span>{children}</label>; }
function Panel({ children, title }: { title?: string; children: React.ReactNode }) { return <section className="studio-panel">{title && <h2>{title}</h2>}{children}</section>; }
function Notice({ children }: { children: React.ReactNode }) { return <div className="studio-notice">{children}</div>; }
function Empty({ title, children }: { title: string; children: React.ReactNode }) { return <div className="studio-empty"><Palette size={32} /><h2>{title}</h2><p>{children}</p></div>; }

export default function Studio() {
  const { pathname } = useLocation();
  const auth = useAuth();
  const admin = pathname.startsWith('/admin');
  const isCreator = pathname.startsWith('/creator');
  const nav = admin ? [
    ['/admin', 'Today', ClipboardList], ['/admin/designs', 'Designs & approvals', Palette], ['/admin/products', 'Products & pricing', Shirt],
    ['/admin/orders', 'Orders & fulfillment', ShoppingBag], ['/admin/families', 'Families & schools', Users], ['/admin/earnings', 'Earnings & discounts', Wallet], ['/admin/settings', 'Settings & connections', Settings],
  ] : isCreator ? [
    ['/creator', 'Overview', ClipboardList], ['/creator/profile', 'My profile', Users], ['/creator/designs', 'My designs', Palette], ['/creator/earnings', 'Earnings & bank account', Wallet], ['/creator/sharing', 'Share my shop', ArrowRight],
  ] : [ ['/parent', 'Overview', ClipboardList], ['/parent/artists', 'My artists', Users], ['/parent/designs', 'My designs', Palette], ['/parent/earnings', 'Earnings & bank account', Wallet], ['/parent/sharing', 'Share my shop', ArrowRight] ];
  const workspace = pathname.startsWith('/parent') || pathname.startsWith('/creator') || admin;
  let body: React.ReactNode;
  if (pathname === '/start') body = <Start />;
  else if (pathname === '/onboarding/parent') body = <Onboarding />;
  else if (pathname === '/onboarding/creator') body = <CreatorOnboarding />;
  else if (pathname === '/onboarding/school' || pathname === '/schools') body = <Schools />;
  else if (auth.loading) body = <Panel><p>Loading…</p></Panel>;
  else if (!auth.session) body = <Navigate to="/start" replace />;
  else if (admin && auth.profile?.role !== 'admin') body = <Panel title="Admin access required"><p>You need an admin account to view this area.</p><Link className="studio-link" to="/parent">Go to your family studio</Link></Panel>;
  else if (admin) body = <Admin path={pathname} />;
  else if (isCreator) {
    if (!auth.profile || auth.profile.role !== 'independent_creator') body = <Navigate to="/parent" replace />;
    else if (auth.profile.onboarding_step !== 'complete') body = <Navigate to="/onboarding/creator" replace />;
    else if (pathname === '/creator/profile') body = <CreatorProfile />;
    else if (pathname === '/creator/submit') body = <CreatorSubmit />;
    else if (pathname.startsWith('/creator/design/')) body = <DesignDetail id={pathname.split('/').pop()!} />;
    else if (pathname === '/creator/designs') body = <DesignList />;
    else if (pathname === '/creator/earnings') body = <CreatorEarnings />;
    else if (pathname === '/creator/sharing') body = <Sharing />;
    else body = <CreatorOverview />;
  }
  else if (!auth.profile?.consent_accepted) body = <Navigate to="/onboarding/parent" replace />;
  else if (pathname === '/parent/artists') body = <Artists />;
  else if (pathname === '/parent/submit') body = <Submit />;
  else if (pathname.startsWith('/parent/design/')) body = <DesignDetail id={pathname.split('/').pop()!} />;
  else if (pathname === '/parent/designs') body = <DesignList />;
  else if (pathname === '/parent/earnings') body = <Earnings />;
  else if (pathname === '/parent/sharing') body = <Sharing />;
  else body = <Overview />;
  return <><TopNav /><div className="studio">
    <div className="studio-workspace">
      {workspace && <aside className="studio-sidebar"><p className="studio-eyebrow">{admin ? 'RENDERED YOUTH ADMIN' : isCreator ? 'YOUR CREATOR STUDIO' : 'YOUR FAMILY STUDIO'}</p><nav aria-label="Workspace">{nav.map(([url, title, Icon]) => <Link key={String(url)} className={pathname === url ? 'active' : ''} to={String(url)}>{React.createElement(Icon as typeof Users, { size: 18 })}{String(title)}</Link>)}</nav>{!admin && <Link className="studio-button" to={isCreator ? '/creator/submit' : '/parent/submit'}>Submit a drawing <ArrowRight size={16} /></Link>}<button className="studio-link" onClick={() => auth.signOut()} style={{ marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer' }}><LogOut size={16} /> Sign out</button></aside>}
      <main className="studio-main">{body}</main>
    </div></div><Footer /></>;
}

function Start() {
  const { session, signOut, profile } = useAuth();
  if (session) return <><p className="studio-eyebrow">A LITTLE IMAGINATION. A WORLD OF POSSIBILITY.</p><h1>Welcome back.</h1><p className="studio-lead">Continue to your studio or explore the shop.</p><div className="studio-grid two">
    <Link className="studio-choice" to={profile?.role === 'independent_creator' ? '/creator' : '/parent'}><Users size={32} /><h2>Go to your studio</h2><p>{profile?.role === 'independent_creator' ? 'Manage your designs and earnings.' : 'Manage your artists, designs, and earnings.'}</p><span>Continue <ArrowRight size={18} /></span></Link>
    <Link className="studio-choice" to="/store"><ShoppingBag size={32} /><h2>Browse the shop</h2><p>Discover original designs from young artists.</p><span>Continue <ArrowRight size={18} /></span></Link>
  </div><button className="studio-link" onClick={() => signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '20px' }}>Sign out</button></>;
  return <><p className="studio-eyebrow">A LITTLE IMAGINATION. A WORLD OF POSSIBILITY.</p><h1>Find your place at Rendered Youth.</h1><p className="studio-lead">Shop a story, help your young artist create, or bring your school together.</p><div className="studio-grid three">
    {[['/store', "I'm here to shop", 'Discover original designs and support a young artist. No account needed to browse.', ShoppingBag], ['/onboarding/parent', "I'm a parent or guardian", "Manage your children's artwork, approve their shops, and receive their earnings.", Users], ['/onboarding/creator', "I'm a young creator", "Old enough to manage your own account? Create, submit, and earn directly.", Palette], ['/onboarding/school', 'I represent a school', 'Learn how a school campaign can turn student creativity into a shared goal.', Shirt]].map(([url, title, description, Icon]) => <Link className="studio-choice" to={String(url)} key={String(url)}>{React.createElement(Icon as typeof Users, { size: 32 })}<h2>{String(title)}</h2><p>{String(description)}</p><span>Continue <ArrowRight size={18} /></span></Link>)}
  </div><Notice>Young artists create with their parent or guardian. The adult owns the account and manages all money and public information. Creators 13 and older can sign up independently with their own account.</Notice></>;
}

function Onboarding() {
  const { session, profile, signUp, signIn, updateProfile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [authError, setAuthError] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Panel><p>Loading…</p></Panel>;

  if (!session) {
    return <><p className="studio-eyebrow">PARENT & GUARDIAN SETUP</p><h1>A home for your family's creativity.</h1><p className="studio-lead">One adult account. A separate creative space for each child.</p>
    <Panel title={isSignUp ? 'Create your parent account' : 'Sign in to your account'}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setAuthError('');
        setSubmitting(true);
        const result = isSignUp
          ? await signUp(email, password, displayName)
          : await signIn(email, password);
        setSubmitting(false);
        if (result.error) setAuthError(result.error.message);
      }}>
        {isSignUp && <Field label="Your name"><input required maxLength={60} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="First name or display name" /></Field>}
        <Field label="Email"><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="Password"><input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></Field>
        {authError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{authError}</p>}
        <Button disabled={submitting}>{submitting ? 'Please wait…' : (isSignUp ? 'Create account' : 'Sign in')} <ArrowRight size={16} /></Button>
      </form>
      <p className="studio-muted">{isSignUp ? 'Already have an account?' : 'Need an account?'} <button className="studio-link" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{isSignUp ? 'Sign in' : 'Sign up'}</button></p>
    </Panel></>;
  }

  const step = !profile?.consent_accepted ? 0 : 1;
  return <><p className="studio-eyebrow">PARENT & GUARDIAN SETUP</p><h1>A home for your family's creativity.</h1><p className="studio-lead">One adult account. A separate creative space for each child.</p><ol className="studio-steps">{['Your account', 'Permission & privacy', 'Your artists'].map((s, i) => <li className={i <= step ? 'current' : ''} key={s}><span>{i < step ? <Check size={16} /> : i + 1}</span>{s}</li>)}</ol>
    {step === 0 ? <Panel title="You decide what gets shared"><div className="studio-grid"><div><ShieldCheck /><h3>Private by default</h3><p>Identity checks and permission come before child details or uploads. A parent approves each public profile and design.</p></div><div><Wallet /><h3>Bank details stay with Stripe</h3><p>Set up your payout account before the first shop goes live. You can begin creating before that step.</p></div></div><label className="studio-check"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />I understand I am the parent or legal guardian responsible for this account and any child profiles I create. I agree to the privacy policy and terms.</label><Button disabled={!consent} onClick={async () => { await updateProfile({ consent_accepted: true, onboarding_step: 'artists' }); }}>Continue to the family studio <ArrowRight size={16} /></Button><p className="studio-muted">This consent is required before creating child profiles. A verified identity check will be added before collecting photos or enabling sales.</p></Panel> : <Panel title="You're ready to add an artist"><p>Start with a display name and an illustrated avatar. You can add another child whenever you like.</p><Link className="studio-button" to="/parent/artists">Add your first artist <ArrowRight size={16} /></Link></Panel>}
  </>;
}

function Overview() {
  const { profile } = useAuth();
  const { artists } = useArtists();
  const { designs } = useDesigns();
  const attention = designs.filter(d => ['choose', 'changes', 'parent_approval'].includes(d.stage));
  return <><p className="studio-eyebrow">YOUR FAMILY STUDIO</p><h1>Let's make something great.</h1><p className="studio-lead">Your artists, their ideas, and the next little step.</p><div className="studio-stats">{[[artists.length, 'Artists'], [designs.length, 'Designs'], [designs.filter(d => d.stage === 'published').length, 'Live designs'], ['$0.00', 'Paid earnings']].map(([n, label]) => <Panel key={label}><strong className="studio-stat">{n}</strong><span>{label}</span></Panel>)}</div><Panel title="Your next step">{!artists.length ? <><p>Add an artist to start their first design.</p><Link className="studio-button" to="/parent/artists">Add an artist</Link></> : attention.length ? attention.map(d => <DesignRow key={d.id} design={d} />) : <><p>{designs.length ? "You're all caught up. We'll show the next action here when a design is ready." : 'Your artist is ready. Start with their first drawing.'}</p><Link className="studio-button" to="/parent/submit">Submit a drawing</Link></>}</Panel>{!profile?.payout_ready && <Notice><strong>One more step before selling:</strong> connect your payout account. <Link to="/parent/earnings">View payout setup →</Link></Notice>}<DesignList compact /></>;
}

function Artists() {
  const { session } = useAuth();
  const { artists, addArtist } = useArtists();
  const [name, setName] = useState(''); const [age, setAge] = useState(''); const [stateVal, setStateVal] = useState('');
  const [bio, setBio] = useState(''); const [goal, setGoal] = useState(''); const [avatar, setAvatar] = useState('star');
  const [showAge, setShowAge] = useState(false); const [showState, setShowState] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  return <><h1>My artists</h1><p className="studio-lead">Every child gets their own story and collection. You manage them all here.</p><div className="studio-grid">{artists.map(a => <Panel key={a.id}><div className="studio-avatar">{a.avatar_type === 'star' ? '★' : a.avatar_type === 'sun' ? '☀' : '✿'}</div><h2>{a.display_name}</h2><p>{a.show_age ? `Age ${a.age}` : 'Age private'}{a.show_state && a.state ? ` · ${a.state}` : ''}</p><p>{a.bio}</p><Link to="/parent/submit" className="studio-link">Create a design →</Link></Panel>)}</div><Panel title="Add an artist"><form onSubmit={async (e) => { e.preventDefault(); setSubmitting(true); await addArtist({ display_name: name.trim(), avatar_type: avatar as 'star' | 'sun' | 'flower', age: age ? Number(age) : null, state: stateVal.trim() || null, show_age: showAge, show_state: showState, bio, goal }); setName(''); setBio(''); setGoal(''); setAge(''); setStateVal(''); setShowAge(false); setShowState(false); setSubmitting(false); }}><div className="studio-grid"><Field label="Artist display name"><input required maxLength={32} value={name} onChange={e => setName(e.target.value)} placeholder="A first name or creative nickname" /></Field><Field label="Age (optional)"><input type="number" min={1} max={17} value={age} onChange={e => setAge(e.target.value)} /></Field><Field label="State (optional)"><input maxLength={32} value={stateVal} onChange={e => setStateVal(e.target.value)} placeholder="State only—no city or school" /></Field><Field label="Choose an avatar"><select value={avatar} onChange={e => setAvatar(e.target.value)}><option value="star">Star</option><option value="sun">Sun</option><option value="flower">Flower</option></select></Field></div><Field label="About the artist (optional)"><textarea maxLength={300} value={bio} onChange={e => setBio(e.target.value)} /></Field><Field label="What are they creating toward? (optional)"><input maxLength={100} value={goal} onChange={e => setGoal(e.target.value)} placeholder="Art supplies, a bike, or a big dream" /></Field><label className="studio-check"><input type="checkbox" checked={showAge} onChange={e => setShowAge(e.target.checked)} disabled={!age} />Show age on the public profile</label><label className="studio-check"><input type="checkbox" checked={showState} onChange={e => setShowState(e.target.checked)} disabled={!stateVal} />Show state on the public profile</label><Notice>Photo and AI caricature options are planned. They will require a separate parent choice before upload and another approval before publication. No photo is needed to participate.</Notice><Button disabled={!name.trim() || submitting}>{submitting ? 'Saving…' : 'Save artist'}</Button></form></Panel></>;
}

function DesignRow({ design }: { design: Design }) { const { artists } = useArtists(); const { pathname } = useLocation(); const base = pathname.startsWith('/creator') ? '/creator' : '/parent'; return <Link className="studio-row" to={`${base}/design/${design.id}`}><span><strong>{design.title}</strong><small>{artists.find(a => a.id === design.artist_id)?.display_name}</small></span><span className="studio-badge">{stageLabels[design.stage]}</span><ChevronRight size={18} /></Link>; }
function DesignList({ compact = false }: { compact?: boolean }) { const { designs } = useDesigns(); const { pathname } = useLocation(); const base = pathname.startsWith('/creator') ? '/creator' : '/parent'; return <>{!compact && <><h1>My designs</h1><p className="studio-lead">See where every idea is on its way to a shirt.</p></>}<Panel title={compact ? 'Your designs' : undefined}>{designs.length ? designs.map(d => <Link key={d.id} className="studio-row" to={`${base}/design/${d.id}`}><span><strong>{d.title}</strong></span><span className="studio-badge">{stageLabels[d.stage]}</span><ChevronRight size={18} /></Link>) : <Empty title="The first idea starts here">Submit a drawing. You&#39;ll see every step in this space.</Empty>}</Panel></>; }
function Submit() {
  const { session } = useAuth();
  const { artists } = useArtists();
  const { addDesign } = useDesigns();
  const navigate = useNavigate();
  const [artistId, setArtistId] = useState(artists[0]?.id ?? '');
  const [title, setTitle] = useState(''); const [story, setStory] = useState('');
  const [checked, check] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => { if (!artistId && artists.length) setArtistId(artists[0].id); }, [artists, artistId]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  async function startCamera() {
    setCameraError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(s);
      setCameraActive(true);
      // Wait for video element to render, then attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      setCameraError('Could not access the camera. Check your browser permissions, or use the upload option instead.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setCameraActive(false);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageDataUrl(dataUrl);
    stopCamera();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('That file is too large. Please use an image under 25 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setUploadError('');
    };
    reader.onerror = () => setUploadError('Could not read that file. Try a different image.');
    reader.readAsDataURL(file);
  }

  async function uploadDrawing(): Promise<string | null> {
    if (!imageDataUrl || !session) return null;
    // Convert data URL to blob
    const res = await fetch(imageDataUrl);
    const blob = await res.blob();
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const fileName = `${session.user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('drawings')
      .upload(fileName, blob, { contentType: blob.type });
    if (upErr) {
      setUploadError(upErr.message);
      return null;
    }
    return fileName;
  }

  if (!artists.length) return <Panel title="First, add your artist"><p>Each drawing belongs to one child in your family.</p><Link className="studio-button" to="/parent/artists">Add an artist</Link></Panel>;
  return <><h1>From doodle to something amazing.</h1><p className="studio-lead">A black marker, white paper, and your artist's imagination.</p><Panel><form onSubmit={async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadError('');
    let drawingPath: string | null = null;
    if (imageDataUrl) drawingPath = await uploadDrawing();
    if (imageDataUrl && !drawingPath) {
      setSubmitting(false);
      return;
    }
    const result = await addDesign({
      artist_id: artistId,
      title: title.trim(),
      story: story.trim(),
      stage: 'draft',
      selected_option: -1,
      completed_batches: 0,
      admin_credits: 0,
      history: [] as any,
      drawing_url: drawingPath,
    });
    setSubmitting(false);
    if (result.error) return;
    if (result.data) navigate(`/parent/design/${result.data.id}`);
  }}>
    <Field label="Who made this drawing?"><select value={artistId} onChange={e => setArtistId(e.target.value)}>{artists.map(a => <option key={a.id} value={a.id}>{a.display_name}</option>)}</select></Field>

    <div className="studio-upload-area">
      {!imageDataUrl && !cameraActive && (
        <div className="studio-upload-choices">
          <div className="studio-upload-choice" role="button" tabIndex={0} onClick={startCamera} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startCamera(); } }}>
            <Camera size={32} />
            <strong>Take a photo</strong>
            <p>Use your phone or laptop camera to capture the drawing.</p>
          </div>
          <div className="studio-upload-choice" role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}>
            <Upload size={32} />
            <strong>Upload an image</strong>
            <p>Choose a photo from your device. On a phone, you can pick from your photos or take a new one.</p>
          </div>
        </div>
      )}

      {cameraActive && (
        <div className="studio-camera">
          <video ref={videoRef} autoPlay playsInline muted className="studio-camera-video" />
          <div className="studio-camera-actions">
            <Button type="button" onClick={capturePhoto}><Camera size={18} /> Capture photo</Button>
            <button type="button" className="studio-link" onClick={stopCamera} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
          </div>
          {cameraError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{cameraError}</p>}
        </div>
      )}

      {imageDataUrl && (
        <div className="studio-upload-preview">
          <img src={imageDataUrl} alt="Drawing preview" className="studio-preview-img" />
          <div className="studio-preview-actions">
            <button type="button" className="studio-link" onClick={() => { setImageDataUrl(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Remove and retake</button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} style={{ display: 'none' }} />
    </div>

    {uploadError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{uploadError}</p>}

    <div className="studio-upload-tips">
      <h3>For the best results</h3>
      <p>Use bright, even light. Keep the page flat. Crop out everything around the paper. A dark marker on white paper works best.</p>
    </div>

    <Field label="Give the design a name"><input value={title} required maxLength={80} onChange={e => setTitle(e.target.value)} placeholder="Rocket dreams" /></Field>
    <Field label="What&#39;s the story behind it?"><textarea required maxLength={1000} value={story} onChange={e => setStory(e.target.value)} placeholder="Tell us what your artist drew and why it matters to them." /></Field>
    <label className="studio-check"><input required type="checkbox" checked={checked} onChange={e => check(e.target.checked)} />I&#39;ve reviewed the story and would approve it for the artist&#39;s shop.</label>
    <Button disabled={!checked || !title.trim() || !story.trim() || submitting}>{submitting ? 'Saving…' : 'Save drawing & continue'} <ArrowRight size={16} /></Button>
    <p className="studio-muted">One initial set of four options. More generations require approval.</p>
  </form></Panel></>;
}

function DrawingImage({ path, title }: { path: string; title: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    supabase.storage.from('drawings').createSignedUrl(path, 3600).then(({ data }) => {
      if (active && data?.signedUrl) setUrl(data.signedUrl);
    });
    return () => { active = false; };
  }, [path]);
  if (!url) return null;
  return <Panel title="Original drawing"><img src={url} alt={title} style={{ maxWidth: '100%', borderRadius: '8px' }} /></Panel>;
}

function DesignDetail({ id }: { id: string }) {
  const { designs, updateDesign, reload } = useDesigns();
  const { profile } = useAuth();
  const d = designs.find(x => x.id === id);
  const [choice, choose] = useState(-1); const [reason, setReason] = useState(''); const [approved, approve] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!d) return;
    const status = (d as any).ai_status as string | undefined;
    if (status === 'generating') {
      setGenerating(true);
      setPolling(true);
    } else if (status === 'ready') {
      setGenerating(false);
      setPolling(false);
      fetchMockups(id).then(m => { if (m) setMockups(m); });
    } else if (status === 'failed') {
      setGenerating(false);
      setPolling(false);
      setGenError((d as any).ai_error ?? 'Generation failed.');
    }
  }, [id, d]);

  useEffect(() => {
    if (!polling || !id) return;
    let active = true;
    const interval = setInterval(async () => {
      const status = await fetchAiStatus(id);
      if (!active || !status) return;
      if (status.status === 'ready') {
        setPolling(false);
        setGenerating(false);
        reload();
        const m = await fetchMockups(id);
        if (m) setMockups(m);
        await updateDesign(id, { stage: 'choose', completed_batches: (d?.completed_batches ?? 0) + 1 } as any);
      } else if (status.status === 'failed') {
        setPolling(false);
        setGenerating(false);
        setGenError(status.error ?? 'Generation failed.');
      }
    }, 4000);
    return () => { active = false; clearInterval(interval); };
  }, [polling, id, d, reload]);

  if (!d) return <Empty title="Design not found">Return to My designs to choose an existing drawing.</Empty>;
  const update = (patch: Partial<Design>) => updateDesign(id, patch as any);
  async function act(action: Action, actor: Actor) { if (!d) return; const stage = transition(d.stage, action, actor); await update({ stage } as any); }
  const { pathname } = useLocation();
  const base = pathname.startsWith('/creator') ? '/creator' : '/parent';

  async function startGeneration() {
    if (!d) return;
    if (!d.drawing_url) { setGenError('Upload a drawing first, then generate.'); return; }
    setGenerating(true);
    setGenError('');
    await updateDesign(id, { stage: 'generating' } as any);
    const result = await generateMockups(id);
    if (!result.success) {
      setGenerating(false);
      setGenError(result.error ?? 'Generation failed.');
      await updateDesign(id, { stage: 'draft' } as any);
      return;
    }
    setPolling(true);
  }

  return <><Link className="studio-link" to={`${base}/designs`}>← My designs</Link><h1>{d.title}</h1><span className="studio-badge">{stageLabels[d.stage]}</span><p className="studio-lead">{d.story}</p>
    {d.drawing_url && <DrawingImage path={d.drawing_url} title={d.title} />}
    {genError && <Panel title="Generation error"><p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{genError}</p><Button onClick={() => { setGenError(''); startGeneration(); }}>Try again</Button></Panel>}
    {d.stage === 'draft' && <Panel title="Ready for four interpretations?"><p>We keep the idea behind the drawing and explore four styles. You choose one.</p>{!d.drawing_url && <Notice>Upload a drawing first to enable generation.</Notice>}<Button disabled={!d.drawing_url || generating} onClick={startGeneration}>{generating ? 'Starting…' : 'Generate four options'} <ArrowRight size={16} /></Button></Panel>}
    {d.stage === 'generating' && <Panel title="Creating four options"><Clock /><p>{generating || polling ? 'The AI is rendering four style options from the drawing. You can leave and return — we\'ll show them here when ready.' : 'Generation complete.'}</p>{generating && <div className="studio-grid">{[0,1,2,3].map(i => <div key={i} className="studio-art" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}><div className="animate-spin" style={{ width: 24, height: 24, border: '3px solid #ccc', borderTopColor: '#333', borderRadius: '50%' }} /></div>)}</div>}</Panel>}
    {d.stage === 'choose' && <><Panel title="Which feels most like the artist?">{mockups.length > 0 ? <div className="studio-grid options">{mockups.map((m, i) => <button aria-pressed={choice === i} className={`studio-art ${choice === i ? 'selected' : ''}`} key={m.id} onClick={() => choose(i)}><img src={m.mockup_url} alt={m.style_label} style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} /><strong>{m.style_label}</strong>{choice === i && <Check size={20} />}</button>)}</div> : <p>Loading your options…</p>}<Button disabled={choice < 0} onClick={() => update({ selected_option: choice, stage: 'review' } as any)}>Approve selected artwork</Button></Panel><Panel title="Need a different direction?"><p>Extra generations need admin approval. Tell us what missed the mark.</p><Field label="What should change?"><textarea maxLength={500} value={reason} onChange={e => setReason(e.target.value)} /></Field><Button disabled={!reason.trim() || !!d.request_note} onClick={() => update({ request_note: reason.trim() } as any)}>{d.request_note ? 'Request sent' : 'Request another set'}</Button>{d.admin_credits > 0 && <Button onClick={() => update({ admin_credits: d.admin_credits - 1, request_note: null, stage: 'generating' } as any)}>Use approved generation</Button>}</Panel></>}
    {['review', 'mockup', 'ready'].includes(d.stage) && <Panel title="We&#39;ll take it from here"><p>{d.stage === 'ready' ? 'Your preview is approved. Admin will check the final requirements and publish it.' : 'Our team checks the artwork and prepares the finished shirt. Your next action will appear here.'}</p><Link className="studio-link" to={base}>Back to overview →</Link></Panel>}
    {d.stage === 'changes' && <Panel title="A small change is needed"><Notice>{d.admin_note}</Notice><p>Edit the drawing or story and send it back for review.</p><Button onClick={() => act('resubmit', 'parent')}>Resubmit</Button></Panel>}
    {d.stage === 'parent_approval' && <Panel title="Review the finished product">{mockups.length > 0 && choice >= 0 && mockups[choice] ? <div className="studio-product-preview"><img src={mockups[choice].mockup_url} alt={mockups[choice].style_label} style={{ maxWidth: '200px', borderRadius: '8px' }} /><div><h2>{d.title}</h2><p>{mockups[choice].style_label}</p><p>{d.story}</p></div></div> : <div className="studio-product-preview"><Shirt size={110} /><div><h2>{d.title}</h2><p>Sample tee</p><strong>{money(3000)}</strong><p>{d.story}</p></div></div>}<Notice>Actual colors, sizes, placement, and price will be shown together before approval.</Notice><label className="studio-check"><input type="checkbox" checked={approved} onChange={e => approve(e.target.checked)} />I approve the artwork, product presentation, and public story.</label><Button disabled={!approved} onClick={() => act('approve', 'parent')}>Approve final product</Button></Panel>}
    {d.stage === 'published' && <Panel title="Your design is published"><p>The workflow is complete. A real product and shareable shop link will be created when Printful and the storefront database are connected.</p><Link to={`${base}/sharing`} className="studio-button">View sharing</Link></Panel>}
    <Panel title="Design journey"><ol className="studio-history">{(Array.isArray(d.history) ? d.history : []).map((h: any, i) => <li key={i}><Check size={16} />{typeof h === 'string' ? h : h.stage}</li>)}</ol></Panel></>;
}

function Earnings() {
  const { profile, updateProfile } = useAuth();
  return <><h1>Earnings & bank account</h1><p className="studio-lead">One parent payout account for all your artists.</p><div className="studio-stats">{['Estimated', 'Pending', 'Available', 'Paid'].map(s => <Panel key={s}><strong className="studio-stat">$0.00</strong><span>{s}</span></Panel>)}</div><Panel title="Connect your payout account"><p>Stripe will collect the adult account holder's bank and required identity details in its hosted setup. Rendered Youth won't ask you to type bank numbers here.</p><span className="studio-badge">{profile?.payout_ready ? 'Payout setup complete' : 'Payout setup needed before publication'}</span><div className="studio-actions"><Button disabled={profile?.payout_ready} onClick={() => updateProfile({ payout_ready: true } as any)}>{profile?.payout_ready ? 'Account connected' : 'Preview completed Stripe setup'}</Button></div><p className="studio-muted">No real bank account is connected. Returning from Stripe alone will not count as completion; the server must verify account requirements.</p></Panel><Panel title="How your share works"><p>Your share agreement will appear here before your first shop is published.</p><p>We deduct the defined fulfillment and payment costs, then calculate your share. Refunds and adjustments appear in your earnings history. A transfer or bank payout can remain pending until it is confirmed.</p><p className="studio-muted">No payout schedule or final share percentage has been set yet.</p></Panel></>;
}

function Sharing() {
  const { designs } = useDesigns();
  const [code, setCode] = useState('');
  const live = designs.some(d => d.stage === 'published');
  return <><h1>Share their creativity.</h1><p className="studio-lead">A shop link and QR code for parents to share with family and friends.</p><Panel title="Shop links & QR codes"><p>{live ? 'Your shop is ready. Real share links and QR codes become available after the storefront is connected.' : 'Your share kit appears after the first design is published.'}</p></Panel><Panel title="Creator-funded discount codes"><p>A discount applies only to your artist's eligible products and comes out of that sale's creator earnings. It cannot use another artist's earnings or reduce the platform share.</p><Field label="Propose a code"><input value={code} maxLength={20} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="ARTBYME" /></Field><Button disabled={!live || !code}>Request a discount code</Button><p className="studio-muted">Admin sets the amount and expiry. The checkout must recheck earnings headroom for each eligible item before accepting a code.</p></Panel></>;
}

function Schools() { return <><p className="studio-eyebrow">CREATE TOGETHER. SUPPORT SOMETHING BIGGER.</p><h1>School fundraising</h1><p className="studio-lead">Student artwork. A shared goal. A campaign your community can wear.</p><Panel title="School campaigns are being prepared"><ol className="studio-history"><li>1. An authorized organizer sets the campaign goal and school recipient.</li><li>2. Parents join by invitation and approve their child's participation.</li><li>3. Families create; the Rendered Youth team reviews and prepares products.</li><li>4. Approved sales support the designated school campaign.</li></ol><p>The school receives the agreed campaign share. Families keep their own separate shops and earnings outside the campaign.</p><Link className="studio-button" to="/contact">Ask about a school pilot</Link></Panel></>; }

// === INDEPENDENT CREATOR COMPONENTS ===

const MIN_CREATOR_AGE = 13;

function CreatorOnboarding() {
  const { session, profile, signUp, signIn, updateProfile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [authError, setAuthError] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [ageError, setAgeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('star');
  const [stateVal, setStateVal] = useState('');
  const [showState, setShowState] = useState(false);
  const [consent, setConsent] = useState(false);

  if (loading) return <Panel><p>Loading…</p></Panel>;

  if (!session) {
    return <><p className="studio-eyebrow">YOUNG CREATOR SETUP</p><h1>Your art. Your account. Your shop.</h1><p className="studio-lead">If you're old enough to manage your own account, you can create, submit, and earn directly — no parent or guardian required.</p>
    <Panel title={isSignUp ? 'Create your creator account' : 'Sign in to your account'}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setAuthError('');
        setSubmitting(true);
        const result = isSignUp
          ? await signUp(email, password, displayName, 'independent_creator')
          : await signIn(email, password);
        setSubmitting(false);
        if (result.error) setAuthError(result.error.message);
      }}>
        {isSignUp && <Field label="Your display name"><input required maxLength={60} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="First name or creative nickname" /></Field>}
        <Field label="Email"><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="Password"><input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></Field>
        {authError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{authError}</p>}
        <Button disabled={submitting}>{submitting ? 'Please wait…' : (isSignUp ? 'Create account' : 'Sign in')} <ArrowRight size={16} /></Button>
      </form>
      <p className="studio-muted">{isSignUp ? 'Already have an account?' : 'Need an account?'} <button className="studio-link" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{isSignUp ? 'Sign in' : 'Sign up'}</button></p>
    </Panel></>;
  }

  const step = profile?.onboarding_step === 'age' ? 0
    : profile?.onboarding_step === 'profile' ? 1
    : profile?.onboarding_step === 'consent' ? 2
    : 3;

  return <><p className="studio-eyebrow">YOUNG CREATOR SETUP</p><h1>Your art. Your account. Your shop.</h1><p className="studio-lead">If you're old enough to manage your own account, you can create, submit, and earn directly.</p><ol className="studio-steps">{['Verify your age', 'Your profile', 'Permission & privacy', 'Ready to create'].map((s, i) => <li className={i <= step ? 'current' : ''} key={s}><span>{i < step ? <Check size={16} /> : i + 1}</span>{s}</li>)}</ol>

    {step === 0 && <Panel title="Verify your age">
      <p>To sign up independently, you must be at least {MIN_CREATOR_AGE} years old. If you're younger, ask a parent or guardian to create a family account.</p>
      <Field label="Date of birth"><input required type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]} /></Field>
      {ageError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{ageError}</p>}
      <Button onClick={async () => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < MIN_CREATOR_AGE) {
          setAgeError(`You must be at least ${MIN_CREATOR_AGE} years old to sign up independently. Ask a parent or guardian to create a family account.`);
          return;
        }
        setAgeError('');
        await updateProfile({ birth_date: birthDate, onboarding_step: 'profile' });
      }}>Continue to profile <ArrowRight size={16} /></Button>
      <p className="studio-muted">Your date of birth is used only to verify your age. It stays private and is never shown on your public profile.</p>
    </Panel>}

    {step === 1 && <Panel title="Set up your creator profile">
      <p>Choose a display name and avatar. This is how you'll appear on your public shop.</p>
      <div className="studio-grid">
        <Field label="Display name"><input required maxLength={32} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="A first name or creative nickname" /></Field>
        <Field label="Choose an avatar"><select value={avatar} onChange={e => setAvatar(e.target.value)}><option value="star">Star</option><option value="sun">Sun</option><option value="flower">Flower</option></select></Field>
        <Field label="State (optional)"><input maxLength={32} value={stateVal} onChange={e => setStateVal(e.target.value)} placeholder="State only—no city or school" /></Field>
      </div>
      <Field label="About you (optional)"><textarea maxLength={300} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell shoppers what you love to create" /></Field>
      <label className="studio-check"><input type="checkbox" checked={showState} onChange={e => setShowState(e.target.checked)} disabled={!stateVal} />Show state on my public profile</label>
      <Button disabled={!displayName.trim()} onClick={async () => {
        await updateProfile({ display_name: displayName.trim(), onboarding_step: 'consent' });
      }}>Continue <ArrowRight size={16} /></Button>
    </Panel>}

    {step === 2 && <Panel title="You decide what gets shared">
      <div className="studio-grid"><div><ShieldCheck /><h3>Private by default</h3><p>Your date of birth and contact details stay private. You approve each design before it goes public.</p></div><div><Wallet /><h3>Bank details stay with Stripe</h3><p>Set up your payout account before your shop goes live. You can start creating before that step.</p></div></div>
      <label className="studio-check"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />I understand I am responsible for this account and all content I submit. I agree to the privacy policy and terms.</label>
      <Button disabled={!consent} onClick={async () => {
        await updateProfile({ consent_accepted: true, onboarding_step: 'complete' });
      }}>Enter my studio <ArrowRight size={16} /></Button>
      <p className="studio-muted">By creating this account, you confirm you are at least {MIN_CREATOR_AGE} years old and can manage your own account.</p>
    </Panel>}

    {step >= 3 && <Panel title="You're ready to create"><p>Your studio is set up. Start by submitting your first drawing.</p><Link className="studio-button" to="/creator/submit">Submit your first drawing <ArrowRight size={16} /></Link></Panel>}
  </>;
}

function CreatorOverview() {
  const { profile } = useAuth();
  const { designs } = useDesigns();
  const { artists } = useArtists();
  const attention = designs.filter(d => ['choose', 'changes', 'parent_approval'].includes(d.stage));
  return <><p className="studio-eyebrow">YOUR CREATOR STUDIO</p><h1>Let's make something great.</h1><p className="studio-lead">Your designs, your ideas, the next little step.</p><div className="studio-stats">{[[designs.length, 'Designs'], [designs.filter(d => d.stage === 'published').length, 'Live designs'], [designs.filter(d => ['review', 'mockup', 'ready'].includes(d.stage)).length, 'In review'], ['$0.00', 'Paid earnings']].map(([n, label]) => <Panel key={label}><strong className="studio-stat">{n}</strong><span>{label}</span></Panel>)}</div><Panel title="Your next step">{attention.length ? attention.map(d => <DesignRow key={d.id} design={d} />) : <><p>{designs.length ? "You're all caught up. We'll show the next action here when a design is ready." : 'Ready to start? Submit your first drawing.'}</p><Link className="studio-button" to="/creator/submit">Submit a drawing</Link></>}</Panel>{!profile?.payout_ready && <Notice><strong>One more step before selling:</strong> connect your payout account. <Link to="/creator/earnings">View payout setup →</Link></Notice>}<DesignList compact /></>;
}

function CreatorProfile() {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [bio, setBio] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [showState, setShowState] = useState(false);
  const [avatar, setAvatar] = useState('star');
  const [saved, setSaved] = useState(false);
  return <><h1>My profile</h1><p className="studio-lead">How you appear on your public shop.</p><Panel title="Profile details"><form onSubmit={async (e) => {
    e.preventDefault();
    await updateProfile({ display_name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }}><Field label="Display name"><input required maxLength={32} value={name} onChange={e => setName(e.target.value)} /></Field><Field label="About me (optional)"><textarea maxLength={300} value={bio} onChange={e => setBio(e.target.value)} /></Field><Field label="State (optional)"><input maxLength={32} value={stateVal} onChange={e => setStateVal(e.target.value)} /></Field><Field label="Choose an avatar"><select value={avatar} onChange={e => setAvatar(e.target.value)}><option value="star">Star</option><option value="sun">Sun</option><option value="flower">Flower</option></select></Field><label className="studio-check"><input type="checkbox" checked={showState} onChange={e => setShowState(e.target.checked)} disabled={!stateVal} />Show state on my public profile</label><Button type="submit">{saved ? 'Saved!' : 'Save profile'}</Button></form></Panel><Panel title="Account details"><p><strong>Email:</strong> {profile?.id ? '' : ''}Your email stays private and is never shown publicly.</p><p><strong>Role:</strong> Independent creator</p></Panel></>;
}

function CreatorSubmit() {
  const { session } = useAuth();
  const { artists, addArtist } = useArtists();
  const { addDesign } = useDesigns();
  const navigate = useNavigate();
  const [title, setTitle] = useState(''); const [story, setStory] = useState('');
  const [checked, check] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Ensure the creator has an artist profile for themselves
  useEffect(() => {
    if (session && !artists.length) {
      addArtist({ display_name: 'Me', avatar_type: 'star', age: null, state: null, show_age: false, show_state: false, bio: '', goal: '' });
    }
  }, [session, artists.length]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  async function startCamera() {
    setCameraError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setStream(s);
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play().catch(() => {}); }
      }, 100);
    } catch (err) {
      setCameraError('Could not access the camera. Check your browser permissions, or use the upload option instead.');
    }
  }

  function stopCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
    setCameraActive(false);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current; const canvas = canvasRef.current;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setImageDataUrl(canvas.toDataURL('image/jpeg', 0.9));
    stopCamera();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 25 * 1024 * 1024) { setUploadError('That file is too large. Please use an image under 25 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { setImageDataUrl(reader.result as string); setUploadError(''); };
    reader.onerror = () => setUploadError('Could not read that file. Try a different image.');
    reader.readAsDataURL(file);
  }

  async function uploadDrawing(): Promise<string | null> {
    if (!imageDataUrl || !session) return null;
    const res = await fetch(imageDataUrl); const blob = await res.blob();
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const fileName = `${session.user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('drawings').upload(fileName, blob, { contentType: blob.type });
    if (upErr) { setUploadError(upErr.message); return null; }
    return fileName;
  }

  const myArtist = artists[0];

  return <><h1>From doodle to something amazing.</h1><p className="studio-lead">A black marker, white paper, and your imagination.</p><Panel><form onSubmit={async (e) => {
    e.preventDefault();
    if (!myArtist) return;
    setSubmitting(true); setUploadError('');
    let drawingPath: string | null = null;
    if (imageDataUrl) drawingPath = await uploadDrawing();
    if (imageDataUrl && !drawingPath) { setSubmitting(false); return; }
    const result = await addDesign({
      artist_id: myArtist.id, title: title.trim(), story: story.trim(),
      stage: 'draft', selected_option: -1, completed_batches: 0, admin_credits: 0,
      history: [] as any, drawing_url: drawingPath,
    });
    setSubmitting(false);
    if (result.error) return;
    if (result.data) navigate(`/creator/design/${result.data.id}`);
  }}>
    <div className="studio-upload-area">
      {!imageDataUrl && !cameraActive && (
        <div className="studio-upload-choices">
          <div className="studio-upload-choice" role="button" tabIndex={0} onClick={startCamera} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startCamera(); } }}>
            <Camera size={32} /><strong>Take a photo</strong><p>Use your phone or laptop camera to capture the drawing.</p>
          </div>
          <div className="studio-upload-choice" role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}>
            <Upload size={32} /><strong>Upload an image</strong><p>Choose a photo from your device. On a phone, you can pick from your photos or take a new one.</p>
          </div>
        </div>
      )}
      {cameraActive && (
        <div className="studio-camera">
          <video ref={videoRef} autoPlay playsInline muted className="studio-camera-video" />
          <div className="studio-camera-actions">
            <Button type="button" onClick={capturePhoto}><Camera size={18} /> Capture photo</Button>
            <button type="button" className="studio-link" onClick={stopCamera} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
          </div>
          {cameraError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{cameraError}</p>}
        </div>
      )}
      {imageDataUrl && (
        <div className="studio-upload-preview">
          <img src={imageDataUrl} alt="Drawing preview" className="studio-preview-img" />
          <div className="studio-preview-actions">
            <button type="button" className="studio-link" onClick={() => setImageDataUrl(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Remove and retake</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} style={{ display: 'none' }} />
    </div>
    {uploadError && <p role="alert" style={{ color: '#c00', fontSize: '14px' }}>{uploadError}</p>}
    <div className="studio-upload-tips"><h3>For the best results</h3><p>Use bright, even light. Keep the page flat. Crop out everything around the paper. A dark marker on white paper works best.</p></div>
    <Field label="Give the design a name"><input value={title} required maxLength={80} onChange={e => setTitle(e.target.value)} placeholder="Rocket dreams" /></Field>
    <Field label="What&#39;s the story behind it?"><textarea required maxLength={1000} value={story} onChange={e => setStory(e.target.value)} placeholder="Tell us what you drew and why it matters to you." /></Field>
    <label className="studio-check"><input required type="checkbox" checked={checked} onChange={e => check(e.target.checked)} />I&#39;ve reviewed the story and would approve it for my shop.</label>
    <Button disabled={!checked || !title.trim() || !story.trim() || submitting}>{submitting ? 'Saving…' : 'Save drawing & continue'} <ArrowRight size={16} /></Button>
    <p className="studio-muted">One initial set of four options. More generations require approval.</p>
  </form></Panel></>;
}

function CreatorEarnings() {
  const { profile, updateProfile } = useAuth();
  return <><h1>Earnings & bank account</h1><p className="studio-lead">Your payout account for your designs.</p><div className="studio-stats">{['Estimated', 'Pending', 'Available', 'Paid'].map(s => <Panel key={s}><strong className="studio-stat">$0.00</strong><span>{s}</span></Panel>)}</div><Panel title="Connect your payout account"><p>Stripe will collect your bank and required identity details in its hosted setup. Rendered Youth won't ask you to type bank numbers here.</p><span className="studio-badge">{profile?.payout_ready ? 'Payout setup complete' : 'Payout setup needed before publication'}</span><div className="studio-actions"><Button disabled={profile?.payout_ready} onClick={() => updateProfile({ payout_ready: true } as any)}>{profile?.payout_ready ? 'Account connected' : 'Preview completed Stripe setup'}</Button></div><p className="studio-muted">No real bank account is connected yet. Stripe Connect onboarding will verify your identity and bank details before your shop goes live.</p></Panel><Panel title="How your share works"><p>Your share agreement will appear here before your first design is published.</p><p>We deduct the defined fulfillment and payment costs, then calculate your share. Refunds and adjustments appear in your earnings history. A transfer or bank payout can remain pending until it is confirmed.</p><p className="studio-muted">No payout schedule or final share percentage has been set yet.</p></Panel></>;
}

function Admin({ path }: { path: string }) {
  const [note, setNote] = useState(''); const [cost, setCost] = useState(21.17); const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(30); const [share, setShare] = useState<number | null>(null);
  const { designs, updateDesign } = useDesigns();
  const { artists } = useArtists();
  if (path === '/admin/settings') return <><h1>Settings & connections</h1><p className="studio-lead">Everything the site needs before real families can join.</p>{['Parent identity & verifiable consent', 'Private artwork storage & AI generation', 'Printful catalog, mockups & fulfillment', 'Stripe Checkout & Connect payouts', 'Email notifications & support'].map(s => <Panel key={s}><h2>{s}</h2><span className="studio-badge">Not connected</span><p>Configure server credentials and complete the integration tests before enabling this service.</p></Panel>)}</>;
  if (path === '/admin/orders') return <><h1>Orders & fulfillment</h1><p className="studio-lead">Paid orders move to Printful after validation. Exceptions need your attention.</p><div className="studio-stats">{['Needs attention', 'Awaiting release', 'In production', 'Shipped'].map(s => <Panel key={s}><strong className="studio-stat">0</strong><span>{s}</span></Panel>)}</div><Empty title="No orders yet">Payment verification, fulfillment jobs, shipment tracking, and refunds must be connected before accepting orders.</Empty></>;
  if (path === '/admin/families') return <><h1>Families & schools</h1><Panel title="Family overview"><p>{artists.length} artists registered.</p>{artists.map(a => <p key={a.id}>{a.display_name} — {designs.filter(d => d.artist_id === a.id).length} designs</p>)}</Panel><Panel title="School campaigns"><p>Pilot setup is pending. Organizer access must be approved; a school role will never be assigned through public self-selection.</p></Panel></>;
  if (path === '/admin/products' || path === '/admin/earnings') {
    let split: ReturnType<typeof splitEarnings> | undefined; let error = '';
    try { split = splitEarnings({ revenue: Math.round(price * 100), costs: Math.round(cost * 100), shareBps: Math.round((share ?? 0) * 100), creatorDiscount: Math.round(discount * 100) }); } catch (e) { error = (e as Error).message; }
    return <><h1>{path.endsWith('products') ? 'Products & pricing' : 'Earnings & discounts'}</h1><p className="studio-lead">You set the catalog and pricing. Families focus on creating.</p><Panel title="Sample pricing worksheet"><Notice>Illustrative amounts only. No product, rate, or discount is being changed in a live account.</Notice><div className="studio-grid"><Field label="Retail price (USD)"><input type="number" min={1} max={500} step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} /></Field><Field label="Fulfillment + processing costs (USD)"><input type="number" min={0} step="0.01" value={cost} onChange={e => setCost(Number(e.target.value))} /></Field><Field label="Creator share of margin (%)"><input type="number" min={0} max={100} value={share ?? ''} placeholder="Not set" onChange={e => setShare(e.target.value === '' ? null : Number(e.target.value))} /></Field><Field label="Creator-funded discount (USD)"><input type="number" min={0} step="0.01" value={discount} onChange={e => setDiscount(Number(e.target.value))} /></Field></div>{error ? <p role="alert">{error}</p> : split && <div className="studio-stats"><Panel><strong className="studio-stat">{money(split.creator)}</strong><span>Creator earnings</span></Panel><Panel><strong className="studio-stat">{money(split.platform)}</strong><span>Platform share</span></Panel><Panel><strong className="studio-stat">{money(split.maxDiscount)}</strong><span>Maximum creator discount</span></Panel></div>}<p className="studio-muted">Changes here affect only the sample worksheet. Live rates must be versioned and acknowledged; old sales must retain their original terms.</p></Panel><Panel title="Launch catalog"><p>Youth tee and adult tee. Specific Printful garments, available sizes/colors, and print placement are pending catalog connection and sample approval.</p></Panel></>;
  }
  const queue = designs.filter(d => ['review', 'mockup', 'ready'].includes(d.stage) || d.request_note);
  return <><p className="studio-eyebrow">THE NEXT RIGHT ACTION</p><h1>{path === '/admin' ? 'Today at Rendered Youth' : 'Designs & approvals'}</h1><p className="studio-lead">Review the idea, prepare the product, and help each artist move forward.</p><div className="studio-stats">{[['Review artwork', designs.filter(d => d.stage === 'review').length], ['Prepare products', designs.filter(d => d.stage === 'mockup').length], ['Ready to publish', designs.filter(d => d.stage === 'ready').length], ['Extra generation requests', designs.filter(d => d.request_note).length]].map(([s, n]) => <Panel key={String(s)}><strong className="studio-stat">{n}</strong><span>{s}</span></Panel>)}</div>{!queue.length && <Empty title="Your queue is clear">Create a drawing in the family view to try the review workflow.</Empty>}{queue.map(d => <Panel key={d.id} title={d.title}><span className="studio-badge">{stageLabels[d.stage]}</span><p>{d.story}</p><p>{d.selected_option >= 0 ? `Family selected: ${sampleStyles[d.selected_option]}` : 'Family has not selected artwork yet.'}</p>{d.request_note && <Notice><strong>Extra generation request:</strong> {d.request_note}<div className="studio-actions"><Button onClick={() => updateDesign(d.id, { admin_credits: d.admin_credits + 1, request_note: null } as any)}>Approve one extra batch</Button><button className="studio-link" onClick={() => updateDesign(d.id, { request_note: null, admin_note: 'Additional generation not approved.' } as any)}>Decline</button></div></Notice>}{d.stage === 'review' && <><Field label="Review note / changes needed"><textarea maxLength={500} value={note} onChange={e => setNote(e.target.value)} /></Field><div className="studio-actions"><Button onClick={() => updateDesign(d.id, { stage: 'mockup' } as any)}>Approve art & prepare product</Button><Button disabled={!note.trim()} onClick={() => updateDesign(d.id, { admin_note: note, stage: 'changes' } as any)}>Request changes</Button></div></>}{d.stage === 'mockup' && <><p>Live preparation will validate the print file, map Printful variants, and save permanent mockup images.</p><Button onClick={() => updateDesign(d.id, { stage: 'parent_approval', variants_ready: true } as any)}>Send sample product preview</Button></>}{d.stage === 'ready' && <><ul className="studio-checklist"><li>○ Verified parent consent</li><li>○ Payout account ready</li><li>○ Share rate set in pricing worksheet</li><li>{d.variants_ready ? '✓' : '○'} Product preview approved</li></ul><Button disabled={!publicationReady({ stage: d.stage, verifiedConsent: true, payoutReady: true, rateSet: share !== null && share >= 0 && share <= 100, variantsReady: d.variants_ready })} onClick={() => updateDesign(d.id, { stage: 'published' } as any)}>Publish sample listing</Button></>}</Panel>)}</>;
}
