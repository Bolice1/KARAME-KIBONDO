import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, Award, Plus, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  center: { name: string };
  _count: { likes: number; saves: number; adoptions: number };
}

export default function KnowledgeNetwork() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/knowledge/feed')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleAdopt = async (postId: string) => {
    // In a real app, adoptingCenterId comes from the logged-in teacher's profile
    const response = await fetch(`http://localhost:3000/api/knowledge/posts/${postId}/adopt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adoptingCenterId: 'current-center-id' })
    });
    
    if (response.ok) {
      alert("Practice adopted! This will now show in your center's methodology list.");
      // Refresh posts to update counts
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">ECD Knowledge Network</h2>
          <p className="text-sm text-neutral-500">Discover and adopt proven practices from across Rwanda</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
          <Plus size={18} /> Share Practice
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Learning', 'Nutrition', 'Health', 'Parenting'].map(cat => (
          <button key={cat} className="px-4 py-1.5 rounded-full border border-neutral-200 bg-white text-sm whitespace-nowrap hover:bg-neutral-50">
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Loading practices...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-soft border border-neutral-100 flex flex-col transition-transform hover:scale-[1.02]">
            <div className="h-48 overflow-hidden relative">
              <img src={post.imageUrl || 'https://via.placeholder.com/400x300?text=ECD+Activity'} alt={post.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                {post.category}
              </span>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[10px] font-bold text-primary-600 uppercase mb-1">{post.center.name}</p>
              <h3 className="font-bold text-neutral-900 mb-2">{post.title}</h3>
              <p className="text-xs text-neutral-600 line-clamp-2 mb-4">{post.description}</p>
              
              <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between">
                <div className="flex gap-3 text-neutral-400">
                  <button className="hover:text-danger transition-colors"><Heart size={18} /></button>
                  <button className="hover:text-primary transition-colors"><Bookmark size={18} /></button>
                  <button className="hover:text-neutral-600 transition-colors"><Share2 size={18} /></button>
                </div>
                
                <button 
                  onClick={() => handleAdopt(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-lg text-xs font-bold hover:bg-success/20 transition-colors"
                >
                  <Award size={14} />
                  Adopt Practice
                  <span className="ml-1 opacity-60">({post._count.adoptions})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}